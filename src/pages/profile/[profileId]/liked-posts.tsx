import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { Layout, PageHeading } from "../../../components/Layout";
import PostsList from "../../../components/Posts/PostsList";
import { useInfiniteScroll, useInfinitePosts } from "../../../hooks";
import { POSTS_LIMIT } from "../../../utils/globals";
import { type RouterInputs } from "../../../utils/trpc";
import { prisma } from "../../../server/db/client";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../../server/trpc/router/_app";
import { type DehydratedState } from "@tanstack/react-query";
import LoadingPage from "../../LoadingPage";
import { createContextInner } from "../../../server/trpc/context";

type LikedPostsPageProps = { trpcState: DehydratedState; profileId: string };

const LikedPostsPage: NextPage<LikedPostsPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { profileId } = props;

  const inputData: RouterInputs["post"]["infinitePosts"] = {
    where: {
      likes: {
        some: {
          userId: profileId,
        },
      },
    },
    limit: POSTS_LIMIT,
  };

  const { data, hasNextPage, fetchNextPage, isLoading } = useInfinitePosts({
    input: inputData,
  });

  useInfiniteScroll({ fetchNextPage, hasNextPage });

  if (isLoading || !data) {
    return <LoadingPage />;
  }

  const likedPosts = data.pages.flatMap((page) => page.posts) ?? [];

  return (
    <Layout title="Liked posts">
      <PageHeading>Liked posts</PageHeading>
      <section className="flex flex-col gap-6">
        <PostsList posts={likedPosts} input={inputData} />
      </section>
    </Layout>
  );
};

export default LikedPostsPage;

export async function getStaticProps(
  context: GetStaticPropsContext<{ profileId: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer: superjson,
  });
  const profileId = context.params?.profileId as string;

  await ssg.user.getUserById.prefetch({ userId: profileId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      profileId,
    },
    revalidate: 1,
  };
}
export const getStaticPaths: GetStaticPaths = async () => {
  const users = await prisma.post.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: users.map((user) => ({
      params: {
        profileId: user.id,
      },
    })),
    // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
    fallback: "blocking",
  };
};
