import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout, PageHeading } from "../../../components/Layout";
import { useUserById } from "../../../hooks";
import withAuth from "../../../utils/withAuth";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const profileId = router.query.profileId as string;
  const { data: session } = useSession();
  const { data: foundUser } = useUserById({ userId: profileId });
  if (!session || !foundUser) return null;
  const { user } = session;

  const profileHeading =
    user?.id === profileId ? "My Profile" : `${foundUser.name}'s profile`;

  const profilePosts =
    user?.id === profileId ? "My posts" : `${foundUser.name}'s posts`;

  return (
    <Layout title={profileHeading}>
      <PageHeading>{profileHeading}</PageHeading>
      <div>
        <div className="relative mx-auto mb-4 h-16 w-16">
          <Image
            alt="user-pic"
            fill
            className="rounded-full object-contain"
            src={foundUser.image || "/user.png"}
            sizes="40x40"
          />
        </div>
        <p className="font-semibold">{foundUser.name}</p>
        <p>{foundUser.email}</p>
        <Link href={`/profile/${profileId}/posts`} className="italic underline">
          {profilePosts}
        </Link>
      </div>
    </Layout>
  );
};

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
