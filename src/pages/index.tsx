import { Layout, Loading, PageHeading } from "../components/Layout/";
import { useInfinitePosts, useInfiniteScroll } from "../hooks";
import PostsList from "../components/Posts/PostsList";
import { POSTS_LIMIT } from "../utils/globals";
import type { NextPage } from "next";
import type { RouterInputs } from "../utils/trpc";

const inputData: RouterInputs["post"]["infinitePosts"] = {
  limit: POSTS_LIMIT,
  where: {},
};

const Home: NextPage = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfinitePosts({ input: inputData });

  useInfiniteScroll({ fetchNextPage, hasNextPage });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <Layout>
      <PageHeading>Check out latest posts from our community</PageHeading>
      <section className="flex flex-col gap-4 md:gap-8">
        <PostsList posts={posts} input={inputData} isLoading={isLoading}/>
        {isFetchingNextPage ? <Loading /> : null}
      </section>
    </Layout>
  );
};

export default Home;
