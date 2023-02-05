import Link from "next/link";
import { memo, useCallback } from "react";
import { FaHeart, FaReply } from "react-icons/fa";
import { IconBtn, ProfilePicture } from "../Layout";
import { type RouterInputs, type RouterOutputs } from "../../utils/trpc";
import {
  useLikeAnimation,
  useLikeComment,
  useUnlikeComment,
} from "../../hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type CommentProps = {
  comment: RouterOutputs["comment"]["infiniteComments"]["comments"][number];
  input: RouterInputs["comment"]["infiniteComments"];
};

const Comment: React.FC<CommentProps> = ({ comment, input }) => {
  const { data: session } = useSession();

  const router = useRouter();

  const { mutate: like } = useLikeComment({
    input,
    userId: session?.user?.id as string,
  });

  const { mutate: unlike } = useUnlikeComment({ input });

  const hasLiked = comment.likes.find(
    (like) => like.userId === session?.user?.id
  );

  const { animationClasses, likeAnimation } = useLikeAnimation({ hasLiked });

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
    <div className="flex flex-col gap-4 bg-[#f6f8fa] px-3 py-4 shadow-lg dark:bg-[#21262d]">
      <div className="flex items-center gap-3">
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
          <span className="font-light">{comment.createdAt.toDateString()}</span>
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
        <IconBtn Icon={FaReply} iconColor={"#818181"} count={3} />
      </div>
    </div>
  );
};

export default memo(Comment);
