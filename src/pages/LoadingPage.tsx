import { Layout, Loading } from "../components/Layout";

const LoadingPage = () => {
  return (
    <Layout title={"Loading.."}>
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loading />
      </div>
    </Layout>
  );
};

export default LoadingPage;
