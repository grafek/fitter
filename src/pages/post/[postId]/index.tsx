import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { usePostById } from "../../../hooks";
import { Layout } from "../../../components/Layout";
import PostItem from "../../../components/Posts/Post";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../../server/trpc/router/_app";
import { prisma } from "../../../server/db/client";
import superjson from "superjson";
import { type DehydratedState } from "@tanstack/react-query";
import { createContextInner } from "../../../server/trpc/context";
import LoadingPage from "../../LoadingPage";

type PostPageProps = { trpcState: DehydratedState; postId: string };

const PostPage: NextPage<PostPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { postId } = props;

  const inputData = {
    where: {
      id: postId,
    },
  };

  const { data, isLoading } = usePostById({
    input: inputData,
  });

  const foundPost = data?.pages[0]?.posts[0];

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Layout title={foundPost?.title}>
      <section id="post-preview">
        {!foundPost && !isLoading ? <p>No post found!</p> : null}
        {foundPost ? <PostItem post={foundPost} input={inputData} /> : null}
      </section>
    </Layout>
  );
};

export default PostPage;

export async function getStaticProps(
  context: GetStaticPropsContext<{ postId: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer: superjson,
  });
  const postId = context.params?.postId as string;

  await ssg.post.getById.prefetch({ postId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
  });

  return {
    paths: posts.map((post) => ({
      params: {
        postId: post.id,
      },
    })),
    // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
    fallback: "blocking",
  };
};
