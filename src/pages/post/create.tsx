import type { GetServerSideProps, NextPage } from "next";
import { Layout, PageHeading } from "../../components/Layout";
import PostForm from "../../components/Posts/PostForm";
import { useCreatePost } from "../../hooks";
import withAuth from "../../utils/withAuth";

const CreatePostPage: NextPage = () => {
  const { mutateAsync: addPost } = useCreatePost();

  return (
    <Layout title="Add a post">
      <PageHeading>Share your workout with others 😎</PageHeading>
      <section id="create-post">
        <PostForm
          onSubmit={addPost}
          buttonColor="primary"
          buttonText="Create post"
        />
      </section>
    </Layout>
  );
};

export default CreatePostPage;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
