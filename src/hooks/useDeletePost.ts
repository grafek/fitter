import { trpc } from "../utils/trpc";

const useDeletePost = () => {
  const ctx = trpc.useContext();

  return trpc.post.delete.useMutation({
    onSuccess() {
      ctx.post.infinitePosts.invalidate();
    },
  });
};

export default useDeletePost;
