import type { GetServerSideProps, NextPage } from "next";
import { Layout, PageHeading } from "../../components/Layout";
import PostForm from "../../components/Posts/PostForm";
import getSports from "../../utils/getSports";
import withAuth from "../../utils/withAuth";

type CreatePostPageProps = {
  sports: string[];
};

const CreatePostPage: NextPage<CreatePostPageProps> = ({ sports }) => {
  return (
    <Layout title="Add a post">
      <PageHeading>Share your workout with others 😎</PageHeading>
      <section id="create-post">
        <PostForm sports={sports} isEditing={false} />
      </section>
    </Layout>
  );
};

export default CreatePostPage;

export const getServerSideProps: GetServerSideProps<CreatePostPageProps> =
  withAuth(async () => {
    const sports = await getSports();

    return {
      props: { sports },
    };
  });
