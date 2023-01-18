import { type NextPage } from "next";
import { useRouter } from "next/router";
import { usePostById } from "../../../hooks";
import { Layout } from "../../../components/Layout";
import PostItem from "../../../components/Posts/Post";

const PostPage: NextPage = () => {
  const router = useRouter();
  const { postId } = router.query;
  const { data: post, isLoading } = usePostById({ postId } as {
    postId: string;
  });

  return (
    <Layout title={post?.title}>
      <section id="post-preview">
        {!post && !isLoading ? <p>No post found!</p> : null}
        {post ? <PostItem post={post} /> : null}
      </section>
    </Layout>
  );
};

export default PostPage;
