import type { InferGetStaticPropsType, NextPage } from "next";
import { usePostById } from "../../../hooks";
import { Layout } from "../../../components/Layout";
import PostItem from "../../../components/Posts/Post";
import { type DehydratedState } from "@tanstack/react-query";
import LoadingPage from "../../LoadingPage";
import { withPostId, withPostPaths } from "../../../hoc";

type PostPageProps = { trpcState: DehydratedState; postId: string };

const PostPage: NextPage<PostPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { postId } = props;

  const inputData = {
    where: {
      id: postId,
    },
  };

  const { data, isLoading } = usePostById({
    input: inputData,
  });

  const foundPost = data?.pages[0]?.posts[0];

  if (isLoading) {
    return <LoadingPage />;
  }

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

export const getStaticProps = withPostId(async () => {
  return { props: {} };
});

export const getStaticPaths = withPostPaths();
