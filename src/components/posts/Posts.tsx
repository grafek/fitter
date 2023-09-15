import { type RouterInputs, type RouterOutputs } from "../../utils/trpc";
import { POSTS_LIMIT } from "../../utils/globals";
import { PostSkeleton } from "../ui/Skeletons";
import { memo } from "react";
import { PostItem } from "./PostItem";

type PostsProps = {
  posts: RouterOutputs["post"]["infinitePosts"]["posts"];
  input: RouterInputs["post"]["infinitePosts"];
  isLoading: boolean;
};

const Posts: React.FC<PostsProps> = ({ posts, input, isLoading }) => {
  return (
    <>
      {isLoading
        ? Array(POSTS_LIMIT)
            .fill(1)
            .map((_, i) => <PostSkeleton key={i} />)
        : null}

      {!posts.length && !isLoading ? (
        <div className="text-center text-xl">No posts found! </div>
      ) : null}

      {posts.map((post) => (
        <PostItem post={post} key={post.id} input={input} />
      ))}
    </>
  );
};

export default memo(Posts);
