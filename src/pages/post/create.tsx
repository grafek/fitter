import type { NextPage } from "next";
import { useCreatePost } from "../../hooks";
import { PageHeading } from "../../components/UI";
import { PostForm } from "../../components/Posts";
import HeadSEO from "../../components/HeadSEO";
import { METADATA } from "../../utils/globals";

const CreatePostPage: NextPage = () => {
  const { mutateAsync: addPost } = useCreatePost();

  return (
    <>
      <HeadSEO
        canonicalUrl={`${METADATA.siteUrl}/post/create`}
        description={"Create Post"}
        title={"Create Post"}
      />
      <PageHeading>Share your workout with others 😎</PageHeading>
      <section id="create-post">
        <PostForm
          onSubmit={addPost}
          buttonColor="primary"
          buttonText="Create post"
        />
      </section>
    </>
  );
};

export default CreatePostPage;
