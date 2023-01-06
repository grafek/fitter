import { type NextPage } from "next";
import { useRouter } from "next/router";
import { usePosts } from "../../hooks";
import { Layout, PageHeading } from "../../components/Layout";
import PostItem from "../../components/Posts/Post";

const PostPage: NextPage = () => {
  const { data: posts } = usePosts();

  const router = useRouter();
  const { postId } = router.query;

  if (!posts || posts.length < 1) return null;
  const post = posts?.find((post) => post.id === postId);

  if (!post) return <>No post found!</>;
  return (
    <Layout>
      <PageHeading>{postId}</PageHeading>
      <section id="post-preview">
        <PostItem post={post} />
      </section>
    </Layout>
  );
};

export default PostPage;
