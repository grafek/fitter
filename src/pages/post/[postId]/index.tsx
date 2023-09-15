import type { InferGetStaticPropsType, NextPage } from "next";
import { type DehydratedState } from "@tanstack/react-query";
import { withPostId, withPostPaths } from "../../../hoc";
import { usePostById } from "../../../hooks";
import HeadSEO from "../../../components/layout/HeadSEO";
import { METADATA } from "../../../utils/globals";
import { PostItem } from "../../../components/posts/PostItem";

type PostPageProps = { trpcState: DehydratedState; postId: string };

const PostPage: NextPage<PostPageProps> = (
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
        canonicalUrl={`${METADATA.siteUrl}/${postId}`}
        description={"Post Preview"}
        title={"Post Preview"}
      />
      <section>
        {!foundPost && !isLoading ? <p>No post found!</p> : null}
        {foundPost ? <PostItem post={foundPost} input={inputData} /> : null}
      </section>
    </>
  );
};

export default PostPage;

export const getStaticProps = withPostId(async () => {
  return { props: {} };
});

export const getStaticPaths = withPostPaths();
