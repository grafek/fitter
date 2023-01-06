import { type Post } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type PostItemProps = {
  post: Post;
};

const PostItem = ({ post }: PostItemProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-md bg-[#ebebebd0] p-4 shadow-lg">
      <div className="flex items-center gap-4">
        <Link
          href={`/profile/${post.creatorId}`}
          className="relative h-10 w-10"
        >
          <Image
            alt="user-pic"
            fill
            className="rounded-full object-contain"
            src={post.creatorImage || "/user.png"}
            sizes="40x40"
          />
        </Link>
        <div className="text-sm">
          <Link
            href={`/profile/${post.creatorId}`}
            className="block font-semibold"
          >
            {post.creatorName}
          </Link>
          {post.sport} •{" "}
          <span className="font-light"> {post.workoutDate.toDateString()}</span>
        </div>
      </div>
      <Link href={`/post/${post.id}`}>See post</Link>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p>{post.description}</p>
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
