import type { InferGetStaticPropsType, NextPage } from "next";
import { useSession } from "next-auth/react";
import {
  Button,
  Layout,
  Loading,
  PageHeading,
} from "../../../components/Layout";
import { useInfiniteUsers, useUserById } from "../../../hooks";
import { type DehydratedState } from "@tanstack/react-query";
import Link from "next/link";
import UsersList from "../../../components/Users/UsersList";
import { withProfileId, withProfilePaths } from "../../../hoc";

type FollowingPageProps = {
  trpcState: DehydratedState;
  profileId: string;
};

const FollowingPage: NextPage<FollowingPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { profileId } = props;

  const { data: session } = useSession();

  const { data: foundUser } = useUserById({ userId: profileId });

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteUsers({
    input: {
      where: {
        followers: {
          some: {
            followerId: profileId as string,
          },
        },
      },
    },
  });
  const followingUsers = data?.pages.flatMap((page) => page.users ?? []);

  const loggedUserPage = profileId === session?.user?.id;

  const heading = loggedUserPage
    ? "People who I follow"
    : `People who ${foundUser?.name} follows`;

  const title = loggedUserPage
    ? "My followings"
    : `${foundUser?.name}'s followings`;

  const emptyContent = loggedUserPage
    ? "You do not follow anyone yet!"
    : `${foundUser?.name} does not follow anyone yet!`;

  return (
    <Layout title={title}>
      <PageHeading>{heading}</PageHeading>
      {loggedUserPage ? (
        <Link
          className="text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-800 dark:text-indigo-400 dark:hover:text-indigo-300 "
          href={`/profile/${session?.user?.id}/following-posts`}
        >
          Check posts from people you follow!
        </Link>
      ) : null}
      <UsersList users={followingUsers} />
      {followingUsers && followingUsers?.length < 1 ? (
        <div className="text-center font-semibold">{emptyContent}</div>
      ) : null}
      {isLoading ? <Loading /> : null}
      {hasNextPage ? (
        <div className="flex justify-center pt-8">
          <Button buttonColor="primary" onClick={() => fetchNextPage()}>
            See more..
          </Button>
        </div>
      ) : null}
    </Layout>
  );
};

export default FollowingPage;

export const getStaticProps = withProfileId(async () => {
  return { props: {} };
});

export const getStaticPaths = withProfilePaths();
