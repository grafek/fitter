import Image from "next/image";
import Link from "next/link";
import { type RouterInputs, type RouterOutputs } from "../../utils/trpc";
import { DATE_FORMATTER, DATETIME_FORMATTER } from "../../utils/globals";
import { BsFillTrashFill } from "react-icons/bs";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { FaComment, FaHeart, FaShareAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  useDeletePost,
  useFollowers,
  useInfiniteComments,
  useLikeAnimation,
  useLikePost,
  useUnlikePost,
  useUsers,
} from "../../hooks";
import { useCallback, useState } from "react";
import {
  Button,
  Dropdown,
  FollowBtn,
  IconBtn,
  Loading,
  Modal,
  ProfilePicture,
} from "../ui";
import { toast } from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";
import UsersList from "../users/Users";
import { NavItem } from "../ui/Navigation";
import { DropdownItem } from "../ui/Dropdown";
import PostShare from "./PostShare";
import Comments from "../comments/Comments";
import { COMMENTS_LIMIT } from "../../schemas/comment.schema";
import { CommentForm } from "../comments/CommentForm";

type PostItemProps = {
  post: RouterOutputs["post"]["infinitePosts"]["posts"][number];
  input: RouterInputs["post"]["infinitePosts"];
};

export const PostItem: React.FC<PostItemProps> = ({ post, input }) => {
  const { data: session } = useSession();
  const hasLiked = post.likes.find((like) => like.userId === session?.user?.id);

  const { animationClasses, likeAnimation } = useLikeAnimation({ hasLiked });
  const [commentsShown, setCommentsShown] = useState(false);
  const [removePostModal, setRemovePostModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [usersLikedPostModal, setUsersLikedPostModal] = useState(false);
  const router = useRouter();

  const { mutateAsync: deletePost } = useDeletePost();
  const { mutate: like } = useLikePost({
    userId: session?.user?.id ? session.user.id : "",
    input,
  });
  const { mutate: unlike } = useUnlikePost({ input });
  const { data: usersLikedPost, isLoading } = useUsers({
    input: {
      where: {
        likes: {
          some: {
            postId: post.id,
          },
        },
      },
    },
    enabled: usersLikedPostModal,
  });

  const commentsInputData: RouterInputs["comment"]["infiniteComments"] = {
    limit: COMMENTS_LIMIT,
    where: {
      parentId: null,
      post: {
        id: post.id,
      },
    },
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    error,
    isLoading: commentsLoading,
  } = useInfiniteComments({
    input: commentsInputData,
  });

  const { data: followingIds } = useFollowers({
    input: {
      userId: session?.user?.id ?? "",
    },
    enabled: session?.user ? true : false,
  });
  const isFollowing = followingIds?.includes(post.creatorId);

  const toggleLike = useCallback(async () => {
    if (!session) {
      router.push("/auth/sign-in");
      return;
    }
    if (hasLiked) {
      unlike({ postId: post.id });
      return;
    }
    like({ postId: post.id });
    await likeAnimation();
  }, [hasLiked, like, likeAnimation, post.id, router, session, unlike]);

  const toggleComments = useCallback(() => {
    if (!session) {
      router.push("/auth/sign-in");
      return;
    }
    setCommentsShown((prev) => !prev);
  }, [router, session]);

  const removePost = useCallback(async () => {
    const toastId = toast.loading("Removing post..", {
      icon: "🚮",
      style: { color: "#dc2626" },
    });
    try {
      await deletePost({ postId: post.id });
      toast.success("Post removed!", { id: toastId });
    } catch (e) {
      if (e instanceof TRPCClientError) {
        toast.error(e.message, { id: toastId });
      }
    }

    router.push("/");
  }, [deletePost, post.id, router]);

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  const isOwner = post.creatorId === session?.user?.id;

  const seePost = router.query.postId ? null : (
    <Link
      href={`/post/${post.id}`}
      className="w-fit text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-800 dark:text-indigo-400 dark:hover:text-indigo-300 "
    >
      See post
    </Link>
  );

  const updatedAtContent =
    post.updatedAt.getTime() === post.createdAt.getTime() ? null : (
      <span className="font-light italic">
        Edited at: {DATETIME_FORMATTER.format(post.updatedAt)}
      </span>
    );

  const imageContent = post.image ? (
    <Link
      href={post.image}
      target="_blank"
      className="relative mb-8 h-60 rounded-lg bg-gradient-to-br from-slate-100 to-[#ecebeb] dark:from-[#1616208a] dark:to-[#161a2780]"
      rel="noreferrer"
    >
      <Image
        src={post.image}
        fill
        alt="workout-img"
        priority
        sizes="40x40"
        className="mx-auto max-w-fit rounded-md"
      />
    </Link>
  ) : null;

  const postOwnerActions = isOwner ? (
    <Dropdown>
      <DropdownItem>
        <NavItem
          Icon={HiOutlinePencilAlt}
          iconColor="#1d4ed8"
          iconSize="1.5rem"
          linkClasses="justify-center my-1"
          linkDestination={`/post/${post.id}/edit`}
        />
      </DropdownItem>
      <DropdownItem>
        <NavItem
          Icon={BsFillTrashFill}
          onClick={() => setRemovePostModal(true)}
          linkClasses="justify-center my-1"
          iconColor="#dc2626"
          iconSize="1.5rem"
        />
      </DropdownItem>
    </Dropdown>
  ) : null;

  const postActions = (
    <div className="flex">
      <div className="mx-auto flex">
        <IconBtn
          Icon={FaHeart}
          iconColor={hasLiked ? "red" : "#818181"}
          className={`${animationClasses}`}
          title={`${hasLiked ? "Unlike" : "Like"} post`}
          onClick={toggleLike}
        />
        <Button
          onClick={() => setUsersLikedPostModal(true)}
          className="px-2 py-1 text-sm text-gray-800 outline-none hover:bg-[#e5e7eb] dark:text-gray-400 dark:hover:bg-[#1d2229]"
        >
          {post._count.likes}
        </Button>
      </div>
      <IconBtn
        Icon={FaComment}
        iconColor={"#818181"}
        onClick={toggleComments}
        title={`${commentsShown ? "Hide" : "Show"} comments`}
        count={post._count.comments}
      />
      <IconBtn
        Icon={FaShareAlt}
        iconColor={"#818181"}
        onClick={() => setShareModal(true)}
      />
    </div>
  );

  return (
    <div className="flex flex-col justify-between gap-3 rounded-md border border-[#d0d7de] bg-[#f6f8fa] p-4 shadow-lg dark:border-[#30363d] dark:bg-[#161b22]">
      <div className="flex items-center gap-4">
        <Link href={`/profile/${post.creatorId}`}>
          <ProfilePicture imageSrc={post.creator.image} />
        </Link>
        <div className="flex flex-col gap-[2px] text-sm">
          <Link
            href={`/profile/${post.creatorId}`}
            className="text-base font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-indigo-400 dark:hover:text-indigo-300 "
          >
            {post.creator.name}
          </Link>
          <span>{post.sport}</span>
          <span className="font-light">
            {DATE_FORMATTER.format(post.workoutDate)}
          </span>
          {updatedAtContent}
        </div>
        <span className="ml-auto">
          {!isOwner ? (
            <FollowBtn
              isFollowing={isFollowing ?? false}
              followingId={post.creatorId}
            />
          ) : null}
        </span>
        {postOwnerActions}
      </div>
      {seePost}
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="overflow-auto pb-8">{post.description}</p>
      {imageContent}
      {postActions}

      {session?.user && commentsShown ? (
        <div className="flex flex-col divide-y-[1px] rounded-md bg-[#f6f8fa] shadow-lg outline outline-1 outline-[#d0d7de]  dark:divide-gray-700 dark:bg-[#21262d] dark:outline-[#30363d]">
          <>
            <CommentForm postId={post.id} />
            <Comments
              isLoading={commentsLoading}
              comments={comments}
              input={commentsInputData}
              error={error}
            />
          </>
          {comments.length >= COMMENTS_LIMIT && hasNextPage ? (
            <Button
              onClick={() => {
                fetchNextPage();
              }}
              isRounded
              className="m-2 py-2 text-blue-700 outline-blue-600 hover:bg-gray-200 dark:text-blue-500 dark:hover:bg-gray-800"
            >
              {isFetchingNextPage ? <Loading /> : "Show more comments"}
            </Button>
          ) : null}
        </div>
      ) : null}

      {removePostModal ? (
        <Modal
          actionTitle="Delete Post"
          hideModal={() => setRemovePostModal(false)}
          isOpen={removePostModal}
        >
          <h2>Are you sure to remove this post?</h2>
          <Button
            buttonColor="danger"
            onClick={removePost}
            className="mx-auto w-1/2"
          >
            Remove
          </Button>
        </Modal>
      ) : null}

      {usersLikedPostModal ? (
        <Modal
          actionTitle="Users who liked this post"
          hideModal={() => setUsersLikedPostModal(false)}
          isOpen={usersLikedPostModal}
        >
          <UsersList users={usersLikedPost} isLoading={isLoading} />
        </Modal>
      ) : null}

      {shareModal ? (
        <PostShare
          isOpen={shareModal}
          setIsOpen={setShareModal}
          postId={post.id}
        />
      ) : null}
    </div>
  );
};
