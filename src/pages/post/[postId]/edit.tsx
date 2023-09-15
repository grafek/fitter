import { usePostById } from "../../../hooks";
import type { InferGetStaticPropsType, NextPage } from "next";
import { type DehydratedState } from "@tanstack/react-query";
import { withPostId, withPostPaths } from "../../../hoc";
import HeadSEO from "../../../components/layout/HeadSEO";
import { METADATA } from "../../../utils/globals";
import PostForm from "../../../components/posts/PostForm";

type EditPostPageProps = { trpcState: DehydratedState; postId: string };

const EditPostPage: NextPage<EditPostPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
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
