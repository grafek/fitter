import { trpc } from "../utils/trpc";

const useUsersPosts = ({ userId }: { userId: string }) => {
  return trpc.post.getUsersPosts.useQuery({ userId });
};

export default useUsersPosts;
