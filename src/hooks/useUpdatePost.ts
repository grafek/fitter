import { trpc } from "../utils/trpc";

function useUpdatePost() {
  const ctx = trpc.useContext();

  return trpc.post.update.useMutation({
    onSettled() {
      ctx.post.getAll.invalidate();
    },
  });
}

export default useUpdatePost;
