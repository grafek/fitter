import { Layout, Loading, PageHeading } from "../components/Layout/";
import { useInfinitePosts, useInfiniteScroll } from "../hooks";
import PostsList from "../components/Posts/PostsList";
import { POSTS_LIMIT } from "../utils/globals";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../server/trpc/router/_app";
import type { NextPage } from "next";
import superjson from "superjson";
import { createContextInner } from "../server/trpc/context";
import LoadingPage from "./LoadingPage";
import type { RouterInputs } from "../utils/trpc";

const inputData: RouterInputs["post"]["infinitePosts"] = {
  limit: POSTS_LIMIT,
  where: {},
};

const Home: NextPage = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfinitePosts({ input: inputData });

  useInfiniteScroll({ fetchNextPage, hasNextPage });

  if (!data || isLoading) return <LoadingPage />;

  const posts = data.pages.flatMap((page) => page.posts) ?? [];

  return (
    <Layout>
      <PageHeading>Check out latest posts from our community</PageHeading>
      <section className="flex flex-col gap-4 md:gap-8">
        <PostsList posts={posts} input={inputData} />
        {isFetchingNextPage ? <Loading /> : null}
      </section>
    </Layout>
  );
};

export default Home;

export async function getStaticProps() {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer: superjson,
  });

  await ssg.post.infinitePosts.prefetchInfinite(inputData);

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
}
