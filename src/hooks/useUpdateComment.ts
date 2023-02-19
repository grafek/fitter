import { trpc } from "../utils/trpc";

const useUpdateComment = () => {
  const ctx = trpc.useContext();

  return trpc.comment.update.useMutation({
    onSuccess() {
      ctx.comment.infiniteComments.invalidate();
    },
  });
};

export default useUpdateComment;
