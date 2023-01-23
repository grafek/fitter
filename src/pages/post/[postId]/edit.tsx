import { type NextPage, type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Layout } from "../../../components/Layout";
import PostForm from "../../../components/Posts/PostForm";
import { usePostById, useUpdatePost } from "../../../hooks";
import withAuth from "../../../utils/withAuth";

const EditPostPage: NextPage = () => {
  const router = useRouter();
  const postId = router.query.postId as string;
  const inputData = {
    where: {
      id: postId,
    },
  };
  const { data, isLoading } = usePostById({
    input: inputData,
  });

  const foundPost = data?.pages[0]?.posts[0];
  const { mutateAsync: updatePost } = useUpdatePost();

  return (
    <Layout title="Edit post">
      <section id="edit-post">
        {!foundPost && !isLoading ? <p>No post found!</p> : null}
        {foundPost ? (
          <PostForm
            post={foundPost}
            isEditing
            onSubmit={updatePost}
            buttonColor="success"
            buttonText="Update post"
            redirectPath={`/post/${foundPost.id}`}
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
