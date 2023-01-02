import Head from "next/head";
import { Header, Footer } from "./";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Fitter</title>
        <meta name="title" content="Fitter - Share your fitness journey!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-[#eeeeee]">
        <Header />
        <main className="container mx-auto min-h-screen px-4 py-6 max-w-[1024px]">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
