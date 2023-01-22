import { type NextPage } from "next";
import { useRouter } from "next/router";
import { usePostById } from "../../../hooks";
import { Layout } from "../../../components/Layout";
import PostItem from "../../../components/Posts/Post";

const PostPage: NextPage = () => {
  const router = useRouter();
  const postId = router.query.postId as string;
  const inputData = {
    where: {
      id: postId,
    },
  };
  const { data, isLoading } = usePostById({
    input: inputData,
  });

  const foundPost = data?.pages[0]?.posts[0];

  return (
    <Layout title={foundPost?.title}>
      <section id="post-preview">
        {!foundPost && !isLoading ? <p>No post found!</p> : null}
        {foundPost ? <PostItem post={foundPost} input={inputData} /> : null}
      </section>
    </Layout>
  );
};

export default PostPage;
