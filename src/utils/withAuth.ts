import type { GetServerSidePropsContext, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const withAuth = (gssp: GetServerSideProps) => {
  return async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);

    if (!session) {
      return {
        redirect: {
          destination: "/sign-in",
          permanent: false,
        },
      };
    }
    const gsspData = await gssp(ctx); // Run `getServerSideProps` to get page-specific data

    return {
      props: { ...gsspData },
    };
  };
};

export default withAuth;
