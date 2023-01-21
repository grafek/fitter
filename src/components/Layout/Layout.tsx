import Head from "next/head";
import { useLoading } from "../../hooks";
import { Header, Footer, Loading } from "./";

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title = "" }) => {
  const { isLoading } = useLoading();
  return (
    <>
      <Head>
        <title>{!title ? "Fitter" : `Fitter | ${title}`}</title>
        <meta name="title" content="Fitter - Share your fitness journey!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen dark:bg-[#21262d] dark:text-[#c9d1d9]">
        <Header />
        <main className="container mx-auto min-h-screen max-w-5xl px-4 py-6">
          {isLoading ? <Loading spinnerColor="fill-blue-400" /> : children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
