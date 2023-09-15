import type { InferGetStaticPropsType, NextPage } from "next";
import { useSession } from "next-auth/react";
import Posts from "../../../components/posts/Posts";
import {
  useUserById,
  useInfiniteScroll,
  useInfinitePosts,
} from "../../../hooks";
import { METADATA, POSTS_LIMIT } from "../../../utils/globals";
import { type RouterInputs } from "../../../utils/trpc";
import { type DehydratedState } from "@tanstack/react-query";
import { withProfileId, withProfilePaths } from "../../../hoc";
import { PageHeading } from "../../../components/ui";
import HeadSEO from "../../../components/layout/HeadSEO";

type UsersPostsPageProps = { trpcState: DehydratedState; profileId: string };

const UsersPostsPage: NextPage<UsersPostsPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { profileId } = props;

  const inputData: RouterInputs["post"]["infinitePosts"] = {
    where: {
      creator: {
        id: profileId,
      },
    },
    limit: POSTS_LIMIT,
  };

  const { data: session } = useSession();
  const { data: foundUser } = useUserById({ userId: profileId });

  const { data, hasNextPage, fetchNextPage, isLoading } = useInfinitePosts({
    input: inputData,
  });

  useInfiniteScroll({ fetchNextPage, hasNextPage });

  const usersPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  const profilePosts =
    session?.user?.id === profileId ? "My posts" : `${foundUser?.name}'s posts`;

  return (
    <>
      <HeadSEO
        canonicalUrl={`${METADATA.siteUrl}/${profileId}/posts`}
        description={profilePosts}
        title={profilePosts}
      />
      <PageHeading>{profilePosts}</PageHeading>
      <section className="flex flex-col gap-6">
        <Posts posts={usersPosts} input={inputData} isLoading={isLoading} />
      </section>
    </>
  );
};

export default UsersPostsPage;

export const getStaticProps = withProfileId(async () => {
  return { props: {} };
});

export const getStaticPaths = withProfilePaths();
