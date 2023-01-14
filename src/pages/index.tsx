import { type NextPage } from "next";
import { Layout, PageHeading } from "../components/Layout/";
import { useInfinitePosts, useInfiniteScroll } from "../hooks";
import PostsList from "../components/Posts/PostsList";

const Home: NextPage = () => {
  const { data, hasNextPage, fetchNextPage } = useInfinitePosts({
    postsPerPage: 5,
  });

  useInfiniteScroll({ fetchNextPage, hasNextPage });
  if (!data) return null;
  const posts = data.pages.flatMap((page) => page.posts) ?? [];

  return (
    <Layout>
      <PageHeading>Check out latest posts from our community</PageHeading>
      <section className="flex flex-col gap-6">
        <PostsList posts={posts} />
      </section>
    </Layout>
  );
};

export default Home;
