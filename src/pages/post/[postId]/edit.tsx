import { type NextPage, type GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout } from "../../../components/Layout";
import PostForm from "../../../components/Posts/PostForm";
import { usePostById } from "../../../hooks";
import getSports from "../../../utils/getSports";

type EditPostPageProps = {
  sports: string[];
};

const EditPostPage: NextPage<EditPostPageProps> = ({ sports }) => {
  const router = useRouter();
  const { postId } = router.query;

  const { data: post, isLoading } = usePostById({ postId });

  return (
    <Layout title="Edit post">
      <section id="edit-post">
        {!post && !isLoading ? <p>No post found!</p> : null}
        {post ? <PostForm sports={sports} isEditing post={post} /> : null}
      </section>
    </Layout>
  );
};

export default EditPostPage;

export const getServerSideProps: GetServerSideProps<EditPostPageProps> = async (
  ctx
) => {
  const session = await getSession(ctx);
  const sports = await getSports();

  if (!session) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: { sports },
  };
};
