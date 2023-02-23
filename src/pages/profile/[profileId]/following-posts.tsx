import type { InferGetStaticPropsType, NextPage } from "next";
import { Layout, Loading, PageHeading } from "../../../components/Layout";
import { useInfinitePosts, useInfiniteScroll } from "../../../hooks";
import { type DehydratedState } from "@tanstack/react-query";
import PostsList from "../../../components/Posts/PostsList";
import { POSTS_LIMIT } from "../../../utils/globals";
import type { RouterInputs } from "../../../utils/trpc";
import LoadingPage from "../../LoadingPage";
import { withProfileId, withProfilePaths } from "../../../hoc";

type FollowingPageProps = {
  trpcState: DehydratedState;
  profileId: string;
};

const FollowingPage: NextPage<FollowingPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
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

  if (!data || isLoading) return <LoadingPage />;

  const posts = data.pages.flatMap((page) => page.posts) ?? [];

  return (
    <Layout title={"My followings"}>
      <PageHeading>{"Posts from people I follow"}</PageHeading>
      <section className="flex flex-col gap-4 md:gap-8">
        <PostsList posts={posts} input={inputData} />
        {isFetchingNextPage ? <Loading /> : null}
      </section>
    </Layout>
  );
};

export default FollowingPage;

export const getStaticProps = withProfileId(async () => {
  return { props: {} };
});

export const getStaticPaths = withProfilePaths();
