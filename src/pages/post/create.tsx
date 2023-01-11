import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { Layout, PageHeading } from "../../components/Layout";
import PostForm from "../../components/Posts/PostForm";
import getSports from "../../utils/getSports";

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

export const getServerSideProps: GetServerSideProps<
  CreatePostPageProps
> = async (ctx) => {
  const session = await getSession(ctx);
  const sports = await getSports();

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { sports },
  };
};
