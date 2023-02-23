import { trpc } from "../utils/trpc";

const useUnfollow = () => {
  const ctx = trpc.useContext();

  return trpc.follow.unfollow.useMutation({
    onSuccess() {
      ctx.follow.getFollowing.invalidate();
    },
  });
};

export default useUnfollow;
