import { type Post } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDeletePost } from "../../hooks";
import { BsPenFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

type PostItemProps = {
  post: Post;
};

const PostItem = ({ post }: PostItemProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { mutate: deletePost } = useDeletePost();

  const seePost = router.query.postId ? null : (
    <Link
      href={`/post/${post.id}`}
      className="w-fit italic text-indigo-800 underline underline-offset-2 dark:text-indigo-400"
    >
      See post
    </Link>
  );
  // only display 'see post' if it's not been redirected to post details
  const isOwner = post.creatorId === session?.user?.id;

  const updatedAtContent =
    post.updatedAt.getTime() === post.createdAt.getTime() ? null : (
      <span className="font-light italic">
        Edited at: {post.updatedAt.toLocaleString()}
      </span>
    );

  const postActions = isOwner ? (
    <div className="ml-auto flex flex-col items-center gap-2 sm:flex-row">
      <Link
        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#3366ff] md:h-10 md:w-10"
        href={`/post/${post.id}/edit`}
      >
        <BsPenFill className="relative p-1 text-2xl text-[#eeeeee]/80 md:text-3xl" />
      </Link>
      <div className="relative flex h-8 w-8 items-center justify-center  rounded-full bg-[#e60000] md:h-10 md:w-10">
        <AiOutlineClose
          onClick={() => {
            deletePost({ postId: post.id });
          }}
          className="relative p-1 text-3xl md:text-4xl text-[#eeeeee] hover:cursor-pointer"
        />
      </div>
    </div>
  ) : null;

  return (
    <div className="flex flex-col justify-between gap-3 rounded-md border border-[#d0d7de] bg-[#f6f8fa] p-4 shadow-lg dark:border-[#30363d] dark:bg-[#161b22]">
      <div className="flex items-center gap-4 ">
        <Link
          href={`/profile/${post.creatorId}`}
          className={`relative min-h-[40px] min-w-[40px] ${
            session ? "cursor-pointer" : "cursor-default"
          }`}
        >
          <Image
            alt="user-pic"
            fill
            className="rounded-full object-contain"
            src={post.creatorImage || "/user.png"}
            sizes="40x40"
          />
        </Link>
        <div className="flex flex-col gap-1 text-sm">
          <Link
            href={`/profile/${post.creatorId}`}
            className={`block font-semibold ${
              session ? "cursor-pointer" : "cursor-default"
            }`}
          >
            {post.creatorName}
          </Link>
          <span>
            {post.sport} •{" "}
            <span className="font-light">
              {post.workoutDate.toDateString()}
            </span>
          </span>
          {updatedAtContent}
        </div>
        {postActions}
      </div>
      {seePost}
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="overflow-auto">{post.description}</p>
      <div className="relative h-96 w-full ">
        <Image
          src={"/flip.gif"}
          fill
          alt="workout-img"
          priority
          sizes="40x40"
          className="mx-auto min-h-[100px] max-w-md rounded-md "
        />
      </div>

      {/* TODO: ADD COMMENTS SECTION */}
    </div>
  );
};

export default PostItem;
