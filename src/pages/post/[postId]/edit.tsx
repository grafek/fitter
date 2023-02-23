import { Layout } from "../../../components/Layout";
import PostForm from "../../../components/Posts/PostForm";
import { usePostById, useUpdatePost } from "../../../hooks";
import type { InferGetStaticPropsType, NextPage } from "next";
import { type DehydratedState } from "@tanstack/react-query";
import { withPostId, withPostPaths } from "../../../hoc";

type EditPostPageProps = { trpcState: DehydratedState; postId: string };

const EditPostPage: NextPage<EditPostPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { postId } = props;

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

export const getStaticProps = withPostId(async () => {
  return { props: {} };
});

export const getStaticPaths = withPostPaths();
