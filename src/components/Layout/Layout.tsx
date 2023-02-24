import Head from "next/head";
import { Header, Footer, SlideToTop } from "./";

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title = "" }) => {
  return (
    <>
      <Head>
        <title>{!title ? "Fitter" : `Fitter | ${title}`}</title>
        <meta name="title" content="Fitter - Share your fitness journey!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="overlays" />
      <div className="min-h-screen dark:bg-[#21262d] dark:text-[#c9d1d9]">
        <Header />
        <main className="container mx-auto min-h-screen max-w-5xl px-2 pb-6 pt-20">
          {children}
        </main>
        <Footer />
        <SlideToTop />
      </div>
    </>
  );
};

export default Layout;
