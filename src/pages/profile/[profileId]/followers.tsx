import type { InferGetStaticPropsType, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Button, PageHeading } from "../../../components/ui";
import { useInfiniteUsers, useUserById } from "../../../hooks";
import { type DehydratedState } from "@tanstack/react-query";
import Link from "next/link";
import Users from "../../../components/users/Users";
import { withProfileId, withProfilePaths } from "../../../hoc";
import HeadSEO from "../../../components/layout/HeadSEO";
import { METADATA } from "../../../utils/globals";

type FollowersPageProps = {
  trpcState: DehydratedState;
  profileId: string;
};

const FollowersPage: NextPage<FollowersPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { profileId } = props;

  const { data: session } = useSession();

  const { data: foundUser } = useUserById({ userId: profileId });

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteUsers({
    input: {
      where: {
        following: {
          some: {
            followingId: profileId as string,
          },
        },
      },
    },
  });

  const followerUsers = data?.pages.flatMap((page) => page.users ?? []);

  const loggedUserPage = profileId === session?.user?.id;

  const heading = loggedUserPage
    ? "People who follow me"
    : `People who follow ${foundUser?.name}`;

  const title = loggedUserPage
    ? "My followers"
    : `${foundUser?.name}'s followers`;

  return (
    <>
      <HeadSEO
        canonicalUrl={`${METADATA.siteUrl}/${profileId}/followers`}
        description={title}
        title={title}
      />
      <PageHeading>{heading}</PageHeading>
      <section>
        {followerUsers && followerUsers?.length > 1 ? (
          <Link
            className="text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-800 dark:text-indigo-400 dark:hover:text-indigo-300 "
            href={`/profile/${session?.user?.id}/followers-posts`}
            title="Followers Posts"
          >
            Check posts from your followers!
          </Link>
        ) : null}
        <Users isLoading={isLoading} users={followerUsers} />
        {hasNextPage ? (
          <div className="flex justify-center pt-8">
            <Button buttonColor="primary" onClick={() => fetchNextPage()}>
              See more..
            </Button>
          </div>
        ) : null}
      </section>
    </>
  );
};

export default FollowersPage;

export const getStaticProps = withProfileId(async () => {
  return { props: {} };
});

export const getStaticPaths = withProfilePaths();
