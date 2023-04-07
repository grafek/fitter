import { usePostById, useUpdatePost } from "../../../hooks";
import type { InferGetStaticPropsType, NextPage } from "next";
import { type DehydratedState } from "@tanstack/react-query";
import { withPostId, withPostPaths } from "../../../hoc";
import HeadSEO from "../../../components/HeadSEO";
import { METADATA } from "../../../utils/globals";
import { PostForm } from "../../../components/Posts";

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
    <>
      <HeadSEO
        canonicalUrl={`${METADATA.siteUrl}/${postId}/edit`}
        description={"Edit Post"}
        title={"Edit Post"}
      />
      <section>
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
    </>
  );
};

export default EditPostPage;

export const getStaticProps = withPostId(async () => {
  return { props: {} };
});

export const getStaticPaths = withPostPaths();
