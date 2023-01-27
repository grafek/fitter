import { Layout } from "../../../components/Layout";
import PostForm from "../../../components/Posts/PostForm";
import { usePostById, useUpdatePost } from "../../../hooks";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../../server/trpc/router/_app";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";

import { prisma } from "../../../server/db/client";
import superjson from "superjson";
import { type DehydratedState } from "@tanstack/react-query";
import { createContextInner } from "../../../server/trpc/context";

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

export async function getStaticProps(
  context: GetStaticPropsContext<{ postId: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer: superjson,
  });
  const postId = context.params?.postId as string;

  await ssg.post.getById.prefetch({ postId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
  });

  return {
    paths: posts.map((post) => ({
      params: {
        postId: post.id,
      },
    })),
    fallback: "blocking",
  };
};
