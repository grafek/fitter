import { type Post } from "@prisma/client";
import PostItem from "./Post";

const PostsList = ({ posts }: { posts: Post[] }) => {
  return (
    <>
      {posts.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </>
  );
};

export default PostsList;
