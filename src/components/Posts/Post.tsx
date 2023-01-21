import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useDeletePost,
  useLikeOptimistic,
  useUnlikeOptimistic,
} from "../../hooks";
import { BsPenFill } from "react-icons/bs";
import { AiOutlineClose, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Dropdown } from "../Layout";
import { toast } from "react-hot-toast";
import { BiComment, BiShare } from "react-icons/bi";
import { type RouterOutputs } from "../../utils/trpc";

type PostItemProps = {
  post: RouterOutputs["post"]["infinitePosts"]["posts"][number];
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { mutateAsync: deletePost } = useDeletePost();

  const { mutateAsync: like } = useLikeOptimistic(
    session?.user?.id ? session.user.id : ""
  );
  const { mutateAsync: unlike } = useUnlikeOptimistic();

  const isOwner = post.creatorId === session?.user?.id;
  const hasLiked = post.likes.find((like) => like.userId === session?.user?.id);

  const toggleLikePost = async () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    if (hasLiked) {
      await unlike({ postId: post.id });
      return;
    }
    await like({ postId: post.id });
  };

  const removePost = async () => {
    const toastId = toast.loading("Removing post..");
    await deletePost({ postId: post.id });
    toast.success("Post removed!", { id: toastId });
  };

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
      <Link
        className="relative flex h-8 w-8 items-center justify-center rounded-full "
        href={`/post/${post.id}/edit`}
      >
        <BsPenFill className="relative p-1 text-2xl text-[#eeeeee]/80 " />
      </Link>
      <a
        onClick={removePost}
        className="relative flex h-8 w-8 items-center justify-center  rounded-full "
      >
        <AiOutlineClose className="relative p-1 text-3xl text-[#eeeeee] hover:cursor-pointer md:text-4xl" />
      </a>
    </Dropdown>
  ) : null;

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
      <div className="justify flex [&>*]:flex [&>*]:flex-1">
        <div>
          <button
            className="mx-auto flex items-center justify-center gap-2"
            onClick={toggleLikePost}
          >
            {hasLiked ? (
              <AiFillHeart size={"1.5rem"} className=" text-red-600" />
            ) : (
              <AiOutlineHeart size={"1.5rem"} />
            )}
            <span className="text-sm text-gray-400">{post._count.likes}</span>
          </button>
        </div>
        <div>
          <button className="mx-auto flex items-center justify-center gap-2">
            <BiComment size={"1.5rem"} />
            <span className="text-sm text-gray-400">{3}</span>
          </button>
        </div>
        <div>
          <button className="mx-auto flex items-center justify-center gap-2">
            <BiShare size={"1.5rem"} />
            {/* <span className="text-sm text-gray-400">{0}</span> */}
          </button>
        </div>
      </div>

      {/* TODO: ADD COMMENTS SECTION */}
    </div>
  );
};

export default PostItem;
