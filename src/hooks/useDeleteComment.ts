import { trpc } from "../utils/trpc";

const useDeleteComment = () => {
  const ctx = trpc.useContext();

  return trpc.comment.delete.useMutation({
    onSuccess() {
      ctx.comment.infiniteComments.invalidate();
    },
  });
};

export default useDeleteComment;
