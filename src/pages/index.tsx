import { useInfinitePosts, useInfiniteScroll } from "../hooks";
import Posts from "../components/posts/Posts";
import { POSTS_LIMIT } from "../utils/globals";
import type { NextPage } from "next";
import type { RouterInputs } from "../utils/trpc";
import { Loading, PageHeading } from "../components/ui";
import HeadSEO from "../components/layout/HeadSEO";

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
    <>
      <HeadSEO />
      <PageHeading>Check out latest posts from our community</PageHeading>
      <section className="flex flex-col gap-4 md:gap-8">
        <Posts posts={posts} input={inputData} isLoading={isLoading} />
        {isFetchingNextPage ? <Loading /> : null}
      </section>
    </>
  );
};

export default Home;
