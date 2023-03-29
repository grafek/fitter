import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/router";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { SuspenseHelper } from "../components/SuspenseHelper";
import LoadingPage from "./LoadingPage";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  NProgress.configure({ showSpinner: false });
  useEffect(() => {
    const onBeforeChange = (url: string) => {
      if (router.asPath !== url) {
        NProgress.start();
      }
    };

    const onAfterChange = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", onBeforeChange);
    router.events.on("routeChangeComplete", onAfterChange);
    router.events.on("routeChangeError", onAfterChange);

    return () => {
      router.events.off("routeChangeStart", onBeforeChange);
      router.events.off("routeChangeComplete", onAfterChange);
      router.events.off("routeChangeError", onAfterChange);
    };
  }, [router]);

  return (
    <SessionProvider session={session}>
      <SuspenseHelper fallback={<LoadingPage />}>
        <Component {...pageProps} />
        <Toaster />
      </SuspenseHelper>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
