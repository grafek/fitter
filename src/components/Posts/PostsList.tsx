import { type Post } from "@prisma/client";
import PostItem from "./Post";

const PostsList = ({ posts }: { posts: Post[] }) => {
  return (
    <>
      {posts.length < 1 || !posts ? (
        <div className="text-center text-xl">No posts found! </div>
      ) : null}
      {posts.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </>
  );
};

export default PostsList;
