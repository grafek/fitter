import usePosts from "../../hooks/usePosts";
import Post from "./Post";

const PostsList = () => {
  const { data: posts } = usePosts();

  return (
    <>
      {posts?.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </>
  );
};

export default PostsList;
