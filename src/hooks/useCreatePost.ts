import { trpc } from "../utils/trpc";

const useCreatePost = () => {
  const ctx = trpc.useContext();

  return trpc.post.create.useMutation({
    onSuccess() {
      ctx.post.infinitePosts.invalidate();
    },
  });
};

export default useCreatePost;
