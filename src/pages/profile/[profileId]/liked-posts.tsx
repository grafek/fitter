import { type GetServerSideProps, type NextPage } from "next";
import { useRouter } from "next/router";
import { Layout, PageHeading } from "../../../components/Layout";
import PostsList from "../../../components/Posts/PostsList";
import { useInfiniteScroll, useInfinitePosts } from "../../../hooks";
import { POSTS_LIMIT } from "../../../utils/globals";
import { type RouterInputs } from "../../../utils/trpc";
import withAuth from "../../../utils/withAuth";

const LikedPostsPage: NextPage = () => {
  const router = useRouter();
  const profileId = router.query.profileId as string;

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

  const { data, hasNextPage, fetchNextPage } = useInfinitePosts({
    input: inputData,
  });

  useInfiniteScroll({ fetchNextPage, hasNextPage });

  if (!data) return null;
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

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
