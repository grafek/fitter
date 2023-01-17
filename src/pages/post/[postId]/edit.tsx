import { type NextPage, type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Layout } from "../../../components/Layout";
import PostForm from "../../../components/Posts/PostForm";
import { usePostById, useUpdatePost } from "../../../hooks";
import withAuth from "../../../utils/withAuth";

const EditPostPage: NextPage = () => {
  const router = useRouter();
  const { postId } = router.query;

  const { data: post, isLoading } = usePostById({ postId });
  const { mutateAsync: updatePost } = useUpdatePost();

  return (
    <Layout title="Edit post">
      <section id="edit-post">
        {!post && !isLoading ? <p>No post found!</p> : null}
        {post ? (
          <PostForm
            post={post}
            isEditing
            onSubmit={updatePost}
            buttonColor="success"
            buttonText="Update post"
            redirectPath={`/post/${post.id}`}
          />
        ) : null}
      </section>
    </Layout>
  );
};

export default EditPostPage;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
