import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout, PageHeading } from "../../../components/Layout";
import PostsList from "../../../components/Posts/PostsList";
import {
  useUserById,
  useInfiniteScroll,
  useUsersInfinitePosts,
} from "../../../hooks";

const MyPosts = () => {
  const router = useRouter();
  const { profileId } = router.query;
  const { data: session } = useSession();
  const { data: user } = useUserById({
    userId: profileId,
  });
  const { data, hasNextPage, fetchNextPage } = useUsersInfinitePosts({
    postsPerPage: 5,
    userId: profileId,
  });

  useInfiniteScroll({ fetchNextPage, hasNextPage });
  if (!data) return null;
  const usersPosts = data.pages.flatMap((page) => page.posts) ?? [];

  if (!session || !user) return null;

  const profilePosts =
    user?.id === profileId ? "My posts" : `${user.name}'s posts`;

  return (
    <Layout title={profilePosts}>
      <PageHeading>{profilePosts}</PageHeading>
      <section className="flex flex-col gap-6">
        <PostsList posts={usersPosts} />
      </section>
    </Layout>
  );
};

export default MyPosts;
