import { trpc } from "../utils/trpc";

const useCreateComment = () => {
  const ctx = trpc.useContext();

  return trpc.comment.create.useMutation({
    onSuccess() {
      ctx.comment.infiniteComments.invalidate();
      ctx.post.invalidate()
    },
  });
};

export default useCreateComment;
