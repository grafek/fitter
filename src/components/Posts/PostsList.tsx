import usePosts from "../../hooks/usePosts";
import Post from "./Post";

const PostsList = () => {
  const { data: posts } = usePosts();


  return (
    <section className="flex flex-col gap-6">
      {posts?.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </section>
  );
};

export default PostsList;
