import { trpc } from "../utils/trpc";

const useFollow = () => {
  const ctx = trpc.useContext();

  return trpc.follow.follow.useMutation({
    onSuccess() {
      ctx.follow.getFollowing.invalidate();
    },
  });
};

export default useFollow;
