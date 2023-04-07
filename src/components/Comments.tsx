import type { TRPCClientErrorBase } from "@trpc/client";
import type { DefaultErrorShape } from "@trpc/server";
import { type RouterInputs, type RouterOutputs } from "../utils/trpc";
import type { Dispatch, SetStateAction } from "react";
import {
  commentSchemaInput,
  type AddCommentFormSchema,
} from "../schemas/comment.schema";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { Comment } from "@prisma/client";
import { FaHeart, FaReply } from "react-icons/fa";
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { HiPencil } from "react-icons/hi";
import { COMMENTS_LIMIT } from "../schemas/comment.schema";
import { DATETIME_FORMATTER } from "../utils/globals";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import Link from "next/link";
import { memo, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  useCreateComment,
  useDeleteComment,
  useInfiniteComments,
  useLikeAnimation,
  useLikeComment,
  useUnlikeComment,
  useUpdateComment,
  useUsers,
} from "../hooks";
import {
  Button,
  Dropdown,
  IconBtn,
  Modal,
  ProfilePicture,
  TextArea,
} from "./UI";
import { NavItem } from "./UI/Navigation";
import { DropdownItem } from "./UI/Dropdown";
import { CommentSkeleton } from "./UI/Skeletons";
import { toast } from "react-hot-toast";
import UsersList from "./Users";

type CommentsProps = {
  comments: RouterOutputs["comment"]["infiniteComments"]["comments"];
  input: RouterInputs["comment"]["infiniteComments"];
  error: TRPCClientErrorBase<DefaultErrorShape> | null;
  isLoading: boolean;
};

const Comments: React.FC<CommentsProps> = ({
  comments,
  input,
  error,
  isLoading,
}) => {
  return (
    <>
      {isLoading ? <CommentSkeleton /> : null}
      {comments.length < 1 && !error && !isLoading ? (
        <div className="p-4 text-center">So empty... 😶</div>
      ) : error ? (
        <div className="p-4 text-center font-bold text-red-600">
          {error?.message}
        </div>
      ) : null}

      {comments.map((comment) => (
        <CommentItem comment={comment} key={comment.id} input={input} />
      ))}
    </>
  );
};

export default memo(Comments);

type CommentItemProps = {
  comment: RouterOutputs["comment"]["infiniteComments"]["comments"][number];
  input: RouterInputs["comment"]["infiniteComments"];
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, input }) => {
  const childrenCommentsInput: RouterInputs["comment"]["infiniteComments"] = {
    limit: COMMENTS_LIMIT,
    where: {
      parentId: comment.id,
      post: {
        id: comment.postId,
      },
    },
  };

  const { data: session } = useSession();

  const router = useRouter();

  const [isReplying, setIsReplying] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [showReplies, setShowReplies] = useState(false);

  const [removeCommentModal, setRemoveCommentModal] = useState(false);

  const [userLikedCommentModal, setUserLikedCommentModal] = useState(false);

  const { data: usersLikedComment, isLoading: usersLoading } = useUsers({
    input: {
      where: {
        likes: {
          some: {
            commentId: comment.id,
          },
        },
      },
    },
    enabled: userLikedCommentModal,
  });

  const { mutate: like } = useLikeComment({
    input,
    userId: session?.user?.id as string,
  });

  const { mutate: unlike } = useUnlikeComment({ input });

  const hasLiked = comment.likes.find(
    (like) => like.userId === session?.user?.id
  );

  const { animationClasses, likeAnimation } = useLikeAnimation({ hasLiked });

  const { data, error, isLoading } = useInfiniteComments({
    input: childrenCommentsInput,
    enabled: showReplies,
  });

  const { mutateAsync: deleteComment } = useDeleteComment();

  const childrenComments = data?.pages.flatMap((page) => page.comments ?? []);

  const toggleLike = useCallback(async () => {
    if (!session) {
      router.push("/auth/sign-in");
      return;
    }
    if (hasLiked) {
      unlike({ commentId: comment.id });
      return;
    }
    like({ commentId: comment.id });
    await likeAnimation();
  }, [comment.id, hasLiked, like, likeAnimation, router, session, unlike]);

  const removeComment = useCallback(async () => {
    const toastId = toast.loading("Removing comment..", {
      icon: "🚮",
      style: { color: "#dc2626" },
    });
    try {
      await deleteComment({ commentId: comment.id });
      toast.success("Comment removed!", { id: toastId });
    } catch (e) {
      if (e instanceof TRPCClientError) {
        toast.error(e.message, { id: toastId });
      }
    }
  }, [comment.id, deleteComment]);

  const isOwner = comment.userId === session?.user?.id;

  const updatedAtContent =
    comment.updatedAt.getTime() === comment.createdAt.getTime() ? null : (
      <span className="font-light italic">
        Edited at: {comment.updatedAt.toLocaleString()}
      </span>
    );

  const commentActions = (
    <div className="flex max-w-[150px]">
      <IconBtn
        Icon={FaHeart}
        iconColor={hasLiked ? "red" : "#818181"}
        className={`${animationClasses}`}
        title={`${hasLiked ? "Unlike" : "Like"} comment`}
        onClick={toggleLike}
      />
      <Button
        onClick={() => setUserLikedCommentModal(true)}
        className="px-2 text-sm text-gray-800 outline-none hover:bg-[#e5e7eb] dark:text-gray-400 dark:hover:bg-[#1d2229]"
      >
        {comment._count.likes}
      </Button>
      <IconBtn
        Icon={FaReply}
        iconColor={"#818181"}
        onClick={() => {
          setIsReplying((prev) => !prev);
        }}
        title={`${isReplying ? "Cancel" : "Add a"} reply`}
        count={comment._count.children}
      />
    </div>
  );

  const commentOwnerActions = isOwner ? (
    <Dropdown>
      <DropdownItem>
        <NavItem
          Icon={HiPencil}
          iconColor="#1d4ed8"
          iconSize="1.5rem"
          linkClasses="justify-center my-2"
          onClick={() => setIsEditing(true)}
        />
      </DropdownItem>
      <DropdownItem>
        <NavItem
          Icon={BsFillTrashFill}
          onClick={() => setRemoveCommentModal(true)}
          linkClasses="justify-center my-2"
          iconColor="#dc2626"
          iconSize="1.5rem"
        />
      </DropdownItem>
    </Dropdown>
  ) : null;

  return (
    <div
      className={`relative flex flex-col gap-4 bg-[#f6f8fa] p-4 shadow-lg dark:bg-[#21262d]`}
    >
      {comment._count.children ? (
        <Button
          title={`${showReplies ? "Hide" : "Show"} replies`}
          onClick={() => {
            setShowReplies((prev) => !prev);
          }}
          className="absolute left-1 top-2 h-[95%] bg-indigo-300 p-[2px] outline-none hover:bg-indigo-400 dark:bg-blue-900 hover:dark:bg-blue-800"
        />
      ) : null}
      {/* ^^ SHOW REPLIE HORIZONTAL LINE BUTTON */}

      {isEditing ? (
        <CommentForm
          setShowReplies={setShowReplies}
          postId={comment.postId}
          parentId={comment.id}
          comment={comment}
          setIsEditing={setIsEditing}
          isEditing
        />
      ) : (
        <>
          <div className={`flex items-center gap-3`}>
            <Link
              href={`/profile/${comment.user.id}`}
              className={`relative max-h-[38px]`}
            >
              <ProfilePicture imageSrc={comment.user.image} />
            </Link>
            <div className="flex flex-col gap-1 text-sm">
              <Link href={`/profile/${comment.user.id}`}>
                <span className="font-medium">{comment.user.name}</span>
              </Link>
              <span className="font-light">
                {DATETIME_FORMATTER.format(comment.createdAt)}
              </span>
              {updatedAtContent}
            </div>
            {commentOwnerActions}
          </div>
          <p>{comment.text}</p>
          {commentActions}

          {isReplying ? (
            <CommentForm
              setShowReplies={setShowReplies}
              postId={comment.postId}
              parentId={comment.id}
            />
          ) : null}
          {/* ^^ REPLY FORM */}

          {comment._count.children > 0 && childrenComments && showReplies ? (
            <Comments
              isLoading={isLoading}
              comments={childrenComments}
              input={childrenCommentsInput}
              error={error}
            />
          ) : null}

          {/* ^^ LIST CHILDREN COMMENTS */}

          {removeCommentModal ? (
            <Modal
              actionTitle="Delete comment"
              hideModal={() => setRemoveCommentModal(false)}
              isOpen={removeCommentModal}
            >
              <h2>Are you sure to remove this comment?</h2>
              <Button
                buttonColor="danger"
                onClick={removeComment}
                className="mx-auto w-1/2"
              >
                Remove
              </Button>
            </Modal>
          ) : null}

          {userLikedCommentModal ? (
            <Modal
              actionTitle="Users who liked this comment"
              hideModal={() => setUserLikedCommentModal(false)}
              isOpen={userLikedCommentModal}
            >
              <UsersList isLoading={usersLoading} users={usersLikedComment} />
            </Modal>
          ) : null}
        </>
      )}
    </div>
  );
};

type CommentFormProps = {
  postId: string;
  parentId?: string;
  setShowReplies?: Dispatch<SetStateAction<boolean>>;
  comment?: Comment;
  isEditing?: boolean;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
};

export const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  parentId,
  setShowReplies,
  isEditing,
  comment,
  setIsEditing,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddCommentFormSchema>({
    resolver: zodResolver(commentSchemaInput),
  });

  const { mutateAsync: addComment } = useCreateComment();
  const { mutateAsync: updateComment } = useUpdateComment();

  let toastId: string;

  const submitCommentHandler: SubmitHandler<AddCommentFormSchema> = async (
    data
  ) => {
    try {
      toastId = toast.loading("Submitting a comment");
      if (comment && isEditing && setIsEditing) {
        await updateComment({
          commentId: comment.id,
          text: data.commentContent,
        });
        setIsEditing(false);
      } else {
        await addComment({
          postId,
          text: data.commentContent,
          parentId: parentId ? parentId : undefined,
        });
      }
      toast.success("You've added a comment!", { id: toastId });
      reset();
      if (setShowReplies && parentId) {
        setShowReplies(true);
      }
    } catch (e) {
      if (e instanceof TRPCClientError) toast.error(e.message, { id: toastId });
    }
  };
  return (
    <form
      className="min-w-[150px] p-3"
      onSubmit={handleSubmit(submitCommentHandler)}
    >
      <div className="relative top-1">
        <TextArea
          name="commentContent"
          register={register}
          errors={errors.commentContent}
          defaultValue={comment ? comment.text : undefined}
          placeholder="What do you think about this post?"
        />
        {isEditing && setIsEditing ? (
          <Button
            isRounded
            onClick={() => setIsEditing(false)}
            buttonColor="danger"
            title="Dismiss"
            className={`absolute -top-9 right-0 md:-top-12`}
            disabled={isSubmitting}
          >
            <AiOutlineClose size={20} />
          </Button>
        ) : null}
        <Button
          type="submit"
          isRounded
          title="Add a comment"
          className={`${
            errors.commentContent ? "bottom-10" : "bottom-4"
          } absolute right-2 ml-auto bg-indigo-500 p-[10px] text-white outline-indigo-500 hover:bg-indigo-700`}
          disabled={isSubmitting}
        >
          <AiOutlineSend />
        </Button>
      </div>
    </form>
  );
};
