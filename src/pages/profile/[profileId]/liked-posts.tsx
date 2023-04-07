import type { InferGetStaticPropsType, NextPage } from "next";
import PostsList from "../../../components/Posts";
import {
  useInfiniteScroll,
  useInfinitePosts,
  useUserById,
} from "../../../hooks";
import { METADATA, POSTS_LIMIT } from "../../../utils/globals";
import { type RouterInputs } from "../../../utils/trpc";
import { type DehydratedState } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { withProfileId, withProfilePaths } from "../../../hoc";
import { PageHeading } from "../../../components/UI";
import HeadSEO from "../../../components/HeadSEO";

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

  const likedPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <>
      <HeadSEO
        canonicalUrl={`${METADATA.siteUrl}/${profileId}/liked-posts`}
        description={profileHeading}
        title={profileHeading}
      />
      <PageHeading>{profileHeading}</PageHeading>
      <section className="flex flex-col gap-6">
        <PostsList posts={likedPosts} input={inputData} isLoading={isLoading} />
      </section>
    </>
  );
};

export default LikedPostsPage;

export const getStaticProps = withProfileId(async () => {
  return { props: {} };
});

export const getStaticPaths = withProfilePaths();
