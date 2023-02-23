import type { InferGetStaticPropsType, NextPage } from "next";
import { Layout, PageHeading } from "../../../components/Layout";
import PostsList from "../../../components/Posts/PostsList";
import {
  useInfiniteScroll,
  useInfinitePosts,
  useUserById,
} from "../../../hooks";
import { POSTS_LIMIT } from "../../../utils/globals";
import { type RouterInputs } from "../../../utils/trpc";
import { type DehydratedState } from "@tanstack/react-query";
import LoadingPage from "../../LoadingPage";
import { useSession } from "next-auth/react";
import { withProfileId, withProfilePaths } from "../../../hoc";

type LikedPostsPageProps = { trpcState: DehydratedState; profileId: string };

const LikedPostsPage: NextPage<LikedPostsPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { profileId } = props;

  const { data: session } = useSession();
  const { data: foundUser } = useUserById({ userId: profileId });

  const loggedUserPage = profileId === session?.user?.id;

  const profileHeading = loggedUserPage
    ? "My liked posts"
    : `${foundUser?.name}'s liked posts`;

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
    <Layout title={profileHeading}>
      <PageHeading>{profileHeading}</PageHeading>
      <section className="flex flex-col gap-6">
        <PostsList posts={likedPosts} input={inputData} />
      </section>
    </Layout>
  );
};

export default LikedPostsPage;

export const getStaticProps = withProfileId(async () => {
  return { props: {} };
});

export const getStaticPaths = withProfilePaths();
