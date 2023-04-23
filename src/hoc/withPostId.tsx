import superjson from "superjson";
import type { GetStaticProps } from "next";
import { createContextInner } from "../server/trpc/context";
import { appRouter } from "../server/trpc/router/_app";
import { createServerSideHelpers } from "@trpc/react-query/server";

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

    const postId = context.params?.id as string;

    await helpers.post.getById.prefetch({ postId });

    return {
      props: {
        trpcState: helpers.dehydrate(),
        postId: postId ?? null,
      },
      revalidate: 1,
    };
  };
}

export default withPostId;
