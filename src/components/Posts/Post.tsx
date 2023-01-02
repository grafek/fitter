import { Post } from "@prisma/client";
import Image from "next/image";

type PostProps = {
  post: Post;
};

const Post = ({ post }: PostProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-md bg-[#ebebebd0] p-4 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-10">
          <Image
            alt="user-pic"
            fill
            className="rounded-full object-contain"
            src={"/user.png"}
            sizes="40x40"
          />
        </div>
        <div className="text-sm">
          <p className="font-semibold">
            {post.creatorName} •{" "}
            <span className="font-light">Vancouver, CA</span>
          </p>
          <p className="font-light">{post.workout} - 30/12/2022</p>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p>{post.description}</p>
      <div className="relative h-96 w-full ">
        <Image
          src={"/flip.gif"}
          fill
          alt="workout-img"
          priority
          className="mx-auto min-h-[100px] max-w-md rounded-md "
        />
      </div>
      {/* TODO: ADD COMMENTS SECTION */}
    </div>
  );
};

export default Post;
