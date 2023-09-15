import type { InferGetStaticPropsType, NextPage } from "next";
import { Loading, PageHeading } from "../../../components/ui";
import { useInfinitePosts, useInfiniteScroll } from "../../../hooks";
import { type DehydratedState } from "@tanstack/react-query";
import Posts from "../../../components/posts/Posts";
import { METADATA, POSTS_LIMIT } from "../../../utils/globals";
import type { RouterInputs } from "../../../utils/trpc";
import { withProfileId, withProfilePaths } from "../../../hoc";
import HeadSEO from "../../../components/layout/HeadSEO";

type FollowingPageProps = {
  trpcState: DehydratedState;
  profileId: string;
};

const FollowingPage: NextPage<FollowingPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { profileId } = props;

  const inputData: RouterInputs["post"]["infinitePosts"] = {
    limit: POSTS_LIMIT,
    where: {
      creator: {
        followers: {
          some: {
            followerId: profileId,
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
        canonicalUrl={`${METADATA.siteUrl}/${profileId}/following-posts`}
        description={"Posts from people I follow"}
        title={"Posts from people I follow"}
      />
      <PageHeading>{"Posts from people I follow"}</PageHeading>
      <section className="flex flex-col gap-4 md:gap-8">
        <Posts posts={posts} input={inputData} isLoading={isLoading} />
        {isFetchingNextPage ? <Loading /> : null}
      </section>
    </>
  );
};

export default FollowingPage;

export const getStaticProps = withProfileId(async () => {
  return { props: {} };
});

export const getStaticPaths = withProfilePaths();
