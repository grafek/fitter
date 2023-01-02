import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { Layout, PageHeading } from "../components/Layout/";

const MyProfile: NextPage = () => {
  return (
    <Layout>
      <PageHeading>My profile</PageHeading>
    </Layout>
  );
};

export default MyProfile;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
