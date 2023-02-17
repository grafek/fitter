import Link from "next/link";
import { memo, useCallback, useState } from "react";
import { FaHeart, FaReply } from "react-icons/fa";
import { Button, IconBtn, ProfilePicture } from "../Layout";
import { type RouterInputs, type RouterOutputs } from "../../utils/trpc";
import {
  useInfiniteComments,
  useLikeAnimation,
  useLikeComment,
  useUnlikeComment,
} from "../../hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { DATETIME_FORMATTER } from "../../utils/globals";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { COMMENTS_LIMIT } from "../../schemas/comment.schema";

type CommentProps = {
  comment: RouterOutputs["comment"]["infiniteComments"]["comments"][number];
  input: RouterInputs["comment"]["infiniteComments"];
};

const Comment: React.FC<CommentProps> = ({ comment, input }) => {
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

  const [showReplies, setShowReplies] = useState(false);

  const { mutate: like } = useLikeComment({
    input,
    userId: session?.user?.id as string,
  });

  const { mutate: unlike } = useUnlikeComment({ input });

  const hasLiked = comment.likes.find(
    (like) => like.userId === session?.user?.id
  );

  const { animationClasses, likeAnimation } = useLikeAnimation({ hasLiked });

  const { data, error } = useInfiniteComments({
    input: childrenCommentsInput,
    enabled: showReplies,
  });

  const childrenComments = data?.pages.flatMap((page) => page.comments ?? []);

  const toggleLike = useCallback(async () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    if (hasLiked) {
      unlike({ commentId: comment.id });
      return;
    }
    like({ commentId: comment.id });
    await likeAnimation();
  }, [comment.id, hasLiked, like, likeAnimation, router, session, unlike]);

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
          className="absolute top-2 left-1 h-[95%] bg-indigo-300 p-[2px] outline-none hover:bg-indigo-400 dark:bg-blue-900 hover:dark:bg-blue-800"
        />
      ) : null}
      {/* ^^ SHOW REPLIE HORIZONTAL LINE BUTTON */}

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
        </div>
      </div>

      <p>{comment.text}</p>

      <div className="flex max-w-[150px]">
        <IconBtn
          Icon={FaHeart}
          iconColor={hasLiked ? "red" : "#818181"}
          count={comment._count.likes}
          className={`${animationClasses}`}
          title={`${hasLiked ? "Unlike" : "Like"} comment`}
          onClick={toggleLike}
        />
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

      {isReplying ? (
        <CommentForm
          setShowReplies={setShowReplies}
          postId={comment.postId}
          parentId={comment.id}
        />
      ) : null}
      {/* ^^ REPLY FORM */}

      {comment._count.children > 0 && childrenComments && showReplies ? (
        <CommentList
          comments={childrenComments}
          input={childrenCommentsInput}
          error={error}
        />
      ) : null}

      {/* ^^ LIST CHILDREN COMMENTS */}
    </div>
  );
};

export default memo(Comment);
