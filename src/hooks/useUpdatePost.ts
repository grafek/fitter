import { trpc } from "../utils/trpc";

const useUpdatePost = () => {
  const ctx = trpc.useContext();

  return trpc.post.update.useMutation({
    onSuccess() {
      ctx.post.infinitePosts.invalidate();
    },
  });
};

export default useUpdatePost;
