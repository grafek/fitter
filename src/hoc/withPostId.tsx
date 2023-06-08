import superjson from "superjson";
import type { GetStaticProps } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createContextInner } from "../server/trpc/context";
import { appRouter } from "../server/trpc/router/_app";

function withPostId(gsp: GetStaticProps): GetStaticProps {
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
    const postId = context.params?.postId as string;

    await helpers.post.getById.prefetch({ postId });
    return {
      props: {
        trpcState: helpers.dehydrate(),
        postId,
      },
      revalidate: 1,
    };
  };
}

export default withPostId;
