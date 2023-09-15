import type { NextPage } from "next";
import { PageHeading } from "../../components/ui";
import HeadSEO from "../../components/layout/HeadSEO";
import { METADATA } from "../../utils/globals";
import PostForm from "../../components/posts/PostForm";

const CreatePostPage: NextPage = () => {
  return (
    <>
      <HeadSEO
        canonicalUrl={`${METADATA.siteUrl}/post/create`}
        description={"Create Post"}
        title={"Create Post"}
      />
      <PageHeading>Share your workout with others 😎</PageHeading>
      <section id="create-post">
        <PostForm buttonColor="primary" buttonText="Create post" />
      </section>
    </>
  );
};

export default CreatePostPage;
