import { type NextPage } from "next";
import { Layout, PageHeading } from "../components/Layout/";
import PostsList from "../components/Posts/PostsList";
import { usePosts } from "../hooks";

const Home: NextPage = () => {
  const { data: posts } = usePosts();
  if (!posts) return null;

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
