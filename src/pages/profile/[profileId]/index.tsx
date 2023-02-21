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

  const likedPosts =
    session?.user?.id === profileId
      ? "My liked posts"
      : `${foundUser?.name}'s liked posts`;

  return (
    <Layout title={profileHeading}>
      <PageHeading>{profileHeading}</PageHeading>
      <div className="mx-auto mt-5 flex flex-col items-center justify-center gap-4 rounded-lg p-6 shadow-md">
        <div className="relative h-24 w-24">
          <Image
            alt="user-pic"
            fill
            className="rounded-full object-contain"
            src={foundUser?.image || "/user.png"}
            sizes="40x40"
          />
        </div>
        <h2 className="text-2xl font-semibold">{foundUser?.name}</h2>

        <Link
          href={`/profile/${profileId}/posts`}
          className="transform-cpu italic text-blue-600 hover:text-blue-800 underline transition-colors dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {profilePosts}
        </Link>
        <Link
          href={`/profile/${profileId}/liked-posts`}
          className="transform-cpu italic text-blue-600 hover:text-blue-800 underline transition-colors dark:text-indigo-400 dark:hover:text-indigo-300 "
        >
          {likedPosts}
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
