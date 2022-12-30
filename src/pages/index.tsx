import { type NextPage } from "next";
import { Layout } from "../components/Layout/";
import PostsList from "../components/Posts/PostsList";

const Home: NextPage = () => {
  return (
    <Layout>
      <h1 className="pb-4 text-lg font-semibold">
        Check out latest posts from our community
      </h1>
      <PostsList />
    </Layout>
  );
};

export default Home;
