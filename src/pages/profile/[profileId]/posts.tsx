import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout, PageHeading } from "../../../components/Layout";
import PostsList from "../../../components/Posts/PostsList";
import {
  useUserById,
  useInfiniteScroll,
  useInfinitePosts,
} from "../../../hooks";
import { POSTS_LIMIT } from "../../../utils/globals";
import withAuth from "../../../utils/withAuth";

const UsersPostsPage = () => {
  const router = useRouter();
  const profileId = router.query.profileId as string;

  const inputData = {
    where: {
      creator: {
        id: profileId,
      },
    },
    limit: POSTS_LIMIT,
  };

  const { data: session } = useSession();
  const { data: foundUser } = useUserById({ userId: profileId });

  const { data, hasNextPage, fetchNextPage } = useInfinitePosts({
    input: inputData,
  });

  useInfiniteScroll({ fetchNextPage, hasNextPage });

  if (!data) return null;
  const usersPosts = data.pages.flatMap((page) => page.posts) ?? [];

  const profilePosts =
    session?.user?.id === profileId ? "My posts" : `${foundUser?.name}'s posts`;

  return (
    <Layout title={profilePosts}>
      <PageHeading>{profilePosts}</PageHeading>
      <section className="flex flex-col gap-6">
        <PostsList posts={usersPosts} input={inputData} />
      </section>
    </Layout>
  );
};

export default UsersPostsPage;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
