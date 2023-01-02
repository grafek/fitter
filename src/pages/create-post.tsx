import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { Layout, PageHeading } from "../components/Layout/";
import AddPost from "../components/Posts/AddPost";
import getSports from "../utils/getSports";

type CreatePostProps = {
  sports: string[];
};

const CreatePost: NextPage<CreatePostProps> = ({ sports }) => {
  return (
    <Layout>
      <PageHeading>Share your workout with others 😎</PageHeading>
      <section id='create-post'>
        <AddPost sports={sports} />
      </section>
    </Layout>
  );
};

export default CreatePost;

export const getServerSideProps: GetServerSideProps<CreatePostProps> = async (
  ctx
) => {
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
