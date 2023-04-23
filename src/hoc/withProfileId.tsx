import superjson from "superjson";
import type { GetStaticProps } from "next";
import { createContextInner } from "../server/trpc/context";
import { appRouter } from "../server/trpc/router/_app";
import { createServerSideHelpers } from '@trpc/react-query/server';

function withProfileId(gsp: GetStaticProps): GetStaticProps {
  return async (context) => {
    const gspData = await gsp(context);

    if (!("props" in gspData)) {
      throw new Error("invalid getSP result");
    }
    const helpers = createServerSideHelpers({
      router: appRouter,
      ctx: await createContextInner(),
      transformer: superjson,
    });
    const profileId = context.params?.profileId as string;

    await helpers.user.getUserById.prefetch({ userId: profileId });

    return {
      props: {
        trpcState: helpers.dehydrate(),
        profileId,
        ...gspData.props,
      },
      revalidate: 1,
    };
  };
}

export default withProfileId;
