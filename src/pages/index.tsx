import { type NextPage } from "next";
import { Layout, Loading, PageHeading } from "../components/Layout/";
import { useInfinitePosts, useInfiniteScroll } from "../hooks";
import PostsList from "../components/Posts/PostsList";
import { POSTS_LIMIT } from "../utils/globals";

const inputData = {
  limit: POSTS_LIMIT,
  where: {},
};

const Home: NextPage = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfinitePosts({ input: inputData });

  useInfiniteScroll({ fetchNextPage, hasNextPage });
  if (!data) return null;
  const posts = data.pages.flatMap((page) => page.posts) ?? [];

  return (
    <Layout>
      <PageHeading>Check out latest posts from our community</PageHeading>
      <section className="flex flex-col gap-12">
        <PostsList posts={posts} input={inputData} />
        {isFetchingNextPage ? <Loading /> : null}
      </section>
    </Layout>
  );
};

export default Home;
