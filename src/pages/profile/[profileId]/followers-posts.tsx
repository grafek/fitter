import type { InferGetStaticPropsType, NextPage } from "next";
import { Loading, PageHeading } from "../../../components/UI";
import { useInfinitePosts, useInfiniteScroll } from "../../../hooks";
import { type DehydratedState } from "@tanstack/react-query";
import PostsList from "../../../components/Posts";
import { METADATA, POSTS_LIMIT } from "../../../utils/globals";
import type { RouterInputs } from "../../../utils/trpc";
import { withProfileId, withProfilePaths } from "../../../hoc";
import HeadSEO from "../../../components/HeadSEO";

type FollowersPostsPageProps = {
  trpcState: DehydratedState;
  profileId: string;
};

const FollowersPostsPage: NextPage<FollowersPostsPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { profileId } = props;

  const inputData: RouterInputs["post"]["infinitePosts"] = {
    limit: POSTS_LIMIT,
    where: {
      creator: {
        following: {
          some: {
            followingId: profileId,
          },
        },
      },
    },
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfinitePosts({ input: inputData });

  useInfiniteScroll({ fetchNextPage, hasNextPage });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <>
      <HeadSEO
        canonicalUrl={`${METADATA.siteUrl}/${profileId}/followers-posts`}
        description={"Posts from people who follow me"}
        title={"Posts from people who follow me"}
      />
      <PageHeading>{"Posts from people who follow me"}</PageHeading>
      <section title="followers-posts" className="flex flex-col gap-4 md:gap-8">
        <PostsList posts={posts} input={inputData} isLoading={isLoading} />
        {isFetchingNextPage ? <Loading /> : null}
      </section>
    </>
  );
};

export default FollowersPostsPage;

export const getStaticProps = withProfileId(async () => {
  return { props: {} };
});

export const getStaticPaths = withProfilePaths();
