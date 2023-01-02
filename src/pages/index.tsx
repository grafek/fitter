import { type NextPage } from "next";
import { Layout, PageHeading } from "../components/Layout/";
import PostsList from "../components/Posts/PostsList";

const Home: NextPage = () => {
  return (
    <Layout>
      <PageHeading>Check out latest posts from our community</PageHeading>
      <section className="flex flex-col gap-6">
        <PostsList />
      </section>
    </Layout>
  );
};

export default Home;
