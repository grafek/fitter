import type { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Layout, PageHeading } from "../../components/Layout";

const MyProfile: NextPage = () => {
  const router = useRouter();
  const { profileId } = router.query;
  const { data: session } = useSession();
  if (!session || !session.user) return null;
  const { user } = session;
  if (profileId != user.id) {
    console.log("you are not the user which is logged in");

    return null;
  }
  return (
    <Layout>
      <PageHeading>My profile</PageHeading>
      <div className="relative h-16 w-16">
        <Image
          alt="user-pic"
          fill
          className="rounded-full object-contain"
          src={user.image || "/user.png"}
          sizes="40x40"
        />
      </div>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <p>{user.id}</p>
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
