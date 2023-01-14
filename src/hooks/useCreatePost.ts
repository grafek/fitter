import { trpc } from "../utils/trpc";

function useCreatePost() {
  const ctx = trpc.useContext();

  return trpc.post.create.useMutation({
    onSettled() {
      ctx.post.infinitePosts.invalidate();
    },
  });
}

export default useCreatePost;
