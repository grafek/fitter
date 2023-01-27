import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Layout, PageHeading } from "../../../components/Layout";
import { useUserById } from "../../../hooks";
import { prisma } from "../../../server/db/client";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../../server/trpc/router/_app";
import { type DehydratedState } from "@tanstack/react-query";
import LoadingPage from "../../LoadingPage";
import { createContextInner } from "../../../server/trpc/context";

type ProfilePageProps = { trpcState: DehydratedState; profileId: string };

const ProfilePage: NextPage<ProfilePageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { profileId } = props;

  const { data: session, status } = useSession();
  const { data: foundUser, isLoading } = useUserById({ userId: profileId });

  if (status === "loading" || isLoading) {
    return <LoadingPage />;
  }

  const profileHeading =
    session?.user?.id === profileId
      ? "My Profile"
      : `${foundUser?.name}'s profile`;

  const profilePosts =
    session?.user?.id === profileId ? "My posts" : `${foundUser?.name}'s posts`;

  return (
    <Layout title={profileHeading}>
      <PageHeading>{profileHeading}</PageHeading>
      <div>
        <div className="relative mx-auto mb-4 h-16 w-16">
          <Image
            alt="user-pic"
            fill
            className="rounded-full object-contain"
            src={foundUser?.image || "/user.png"}
            sizes="40x40"
          />
        </div>
        <p className="font-semibold">{foundUser?.name}</p>
        <Link href={`/profile/${profileId}/posts`} className="italic underline">
          {profilePosts}
        </Link>
      </div>
    </Layout>
  );
};

export default ProfilePage;

export async function getStaticProps(
  context: GetStaticPropsContext<{ profileId: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer: superjson,
  });
  const profileId = context.params?.profileId as string;

  await ssg.user.getUserById.prefetch({ userId: profileId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      profileId,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await prisma.post.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: users.map((user) => ({
      params: {
        profileId: user.id,
      },
    })),
    // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
    fallback: "blocking",
  };
};
