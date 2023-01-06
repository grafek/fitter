import { usePosts } from "../../hooks";
import PostItem from "./Post";

const PostsList = () => {
  const { data: posts } = usePosts();

  return (
    <>
      {posts?.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </>
  );
};

export default PostsList;
