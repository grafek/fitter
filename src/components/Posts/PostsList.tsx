import { type RouterInputs, type RouterOutputs } from "../../utils/trpc";
import PostItem from "./Post";

type PostListProps = {
  posts: RouterOutputs["post"]["infinitePosts"]["posts"];
  input: RouterInputs["post"]["infinitePosts"];
};

const PostsList: React.FC<PostListProps> = ({ posts, input }) => {
  return (
    <>
      {posts.length < 1 || !posts ? (
        <div className="text-center text-xl">No posts found! </div>
      ) : null}
      {posts.map((post) => (
        <PostItem post={post} key={post.id} input={input} />
      ))}
    </>
  );
};

export default PostsList;
