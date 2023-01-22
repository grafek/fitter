import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useDeletePost,
  useLikeOptimistic,
  useUnlikeOptimistic,
} from "../../hooks";
import { BsFillTrashFill } from "react-icons/bs";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { AiFillHeart } from "react-icons/ai";
import { Dropdown, IconBtn, IconLink } from "../Layout";
import { toast } from "react-hot-toast";
import { BiComment, BiShare } from "react-icons/bi";
import { type RouterInputs, type RouterOutputs } from "../../utils/trpc";
import { useCallback } from "react";

type PostItemProps = {
  post: RouterOutputs["post"]["infinitePosts"]["posts"][number];
  input: RouterInputs["post"]["infinitePosts"];
};

const PostItem: React.FC<PostItemProps> = ({ post, input }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { mutateAsync: deletePost } = useDeletePost();

  const { mutate: like } = useLikeOptimistic({
    userId: session?.user?.id ? session.user.id : "",
    input,
  });
  const { mutate: unlike } = useUnlikeOptimistic({ input });

  const isOwner = post.creatorId === session?.user?.id;

  const hasLiked = post.likes.find((like) => like.userId === session?.user?.id);

  const toggleLikePost = useCallback(() => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    if (hasLiked) {
      unlike({ postId: post.id });
      return;
    }
    like({ postId: post.id });
  }, [hasLiked, like, post.id, router, session, unlike]);

  const removePost = useCallback(async () => {
    const toastId = toast.loading("Removing post..", {
      icon: "🚮",
      style: { color: "#dc2626" },
    });

    await deletePost({ postId: post.id });

    toast.success("Post removed!", { id: toastId });
  }, [deletePost, post.id]);

  const seePost = router.query.postId ? null : (
    <Link
      href={`/post/${post.id}`}
      className="w-fit italic text-indigo-800 underline underline-offset-2 dark:text-indigo-400"
    >
      See post
    </Link>
  );
  // only display 'see post' if it's not been redirected to post details

  const updatedAtContent =
    post.updatedAt.getTime() === post.createdAt.getTime() ? null : (
      <span className="font-light italic">
        Edited at: {post.updatedAt.toLocaleString()}
      </span>
    );

  const imageContent = post.image ? (
    <a
      href={post.image}
      target="_blank"
      className="relative mb-8 h-96"
      rel="noreferrer"
    >
      <Image
        src={post.image}
        fill
        alt="workout-img"
        priority
        sizes="40x40"
        className="mx-auto min-h-[100px] max-w-fit rounded-md object-contain md:object-fill"
      />
    </a>
  ) : null;

  const postOwnerActions = isOwner ? (
    <Dropdown>
      <IconLink
        Icon={HiOutlinePencilAlt}
        href={`/post/${post.id}/edit`}
        iconColor="#1d4ed8"
        iconSize={"1.2rem"}
      />
      <IconBtn
        Icon={BsFillTrashFill}
        iconSize="1.2rem"
        iconColor="#dc2626"
        onClick={removePost}
      />
    </Dropdown>
  ) : null;

  const postActions = (
    <div className="flex">
      <IconBtn
        Icon={AiFillHeart}
        iconColor={hasLiked ? "red" : "gray"}
        count={post._count.likes}
        onClick={toggleLikePost}
      />
      <IconBtn Icon={BiComment} />
      <IconBtn Icon={BiShare} />
    </div>
  );

  return (
    <div className="flex flex-col justify-between gap-3 rounded-md border border-[#d0d7de] bg-[#f6f8fa] p-4 shadow-lg dark:border-[#30363d] dark:bg-[#161b22]">
      <div className="flex items-center gap-4">
        <Link
          href={`/profile/${post.creatorId}`}
          className={`relative min-h-[40px] min-w-[40px]`}
        >
          <Image
            alt={`${post.creator.name}'s profile picture`}
            fill
            className="rounded-full object-contain"
            src={post.creator.image || "/user.png"}
            sizes="40x40"
          />
        </Link>
        <div className="flex flex-col gap-1 text-sm">
          <Link
            href={`/profile/${post.creatorId}`}
            className={`block font-semibold`}
          >
            {post.creator.name}
          </Link>
          <span>
            {post.sport} •{" "}
            <span className="font-light">
              {post.workoutDate.toDateString()}
            </span>
          </span>
          {updatedAtContent}
        </div>
        {postOwnerActions}
      </div>
      {seePost}
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="overflow-auto pb-8">{post.description}</p>
      {imageContent}
      {postActions}
    </div>
  );
};

export default PostItem;
