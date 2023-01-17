import { trpc } from "../utils/trpc";

const useDeletePost = () => {
  const ctx = trpc.useContext();

  return trpc.post.delete.useMutation({
    onSettled() {
      ctx.post.infinitePosts.invalidate();
    },
  });
};

export default useDeletePost;
