import { type NextPage } from "next";
import { Layout } from "../components/Layout/";

const Home: NextPage = () => {
  return (
    <Layout>
      <div>
        <h1 className="font-semibold">
          Check out latest posts from our community
        </h1>
        
      </div>
    </Layout>
  );
};

export default Home;
