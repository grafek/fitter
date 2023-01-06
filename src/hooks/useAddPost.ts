import { trpc } from "../utils/trpc";

function useAddPost() {
  const ctx = trpc.useContext();
  
  return trpc.post.add.useMutation({
    onSettled() {
      ctx.post.getAll.invalidate();
    },
  });
}

export default useAddPost;
