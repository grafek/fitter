import { type NextPage } from "next";
import { Layout, Loading, PageHeading } from "../components/Layout/";
import { useInfinitePosts, useInfiniteScroll } from "../hooks";
import PostsList from "../components/Posts/PostsList";
import { toast } from "react-hot-toast";

const Home: NextPage = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfinitePosts({
      postsPerPage: 5,
    });

  useInfiniteScroll({ fetchNextPage, hasNextPage });
  if (!data) return null;
  const posts = data.pages.flatMap((page) => page.posts) ?? [];

  return (
    <Layout>
      <PageHeading>Check out latest posts from our community</PageHeading>
      <section className="flex flex-col gap-12">
        <button
          onClick={() => {
            toast.success("Toast!");
          }}
        >
          Toast
        </button>
        <PostsList posts={posts} />
        {isFetchingNextPage ? <Loading spinnerColor="fill-blue-500" /> : null}
      </section>
    </Layout>
  );
};

export default Home;
