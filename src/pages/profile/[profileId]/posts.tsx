import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout, PageHeading } from "../../../components/Layout";
import PostsList from "../../../components/Posts/PostsList";
import { useFindUser, useUsersPosts } from "../../../hooks";

const MyPosts = () => {
  const router = useRouter();
  const { profileId } = router.query;
  const { data: session } = useSession();
  const { data: user } = useFindUser({
    userId: profileId,
  });
  const { data: posts } = useUsersPosts({ userId: user ? user.id : "" });

  if (!session || !user || !posts) return null;

  const profilePosts =
    user?.id === profileId ? "My posts" : `${user.name}'s posts`;

  return (
    <Layout title={profilePosts}>
      <PageHeading>{profilePosts}</PageHeading>
      <section className="flex flex-col gap-6">
        <PostsList posts={posts} />
        {posts.length < 1 ? <p>No posts found..</p> : null}
      </section>
    </Layout>
  );
};

export default MyPosts;
