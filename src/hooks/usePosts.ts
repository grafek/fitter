import { trpc } from "../utils/trpc";

const usePosts = () => {
  return trpc.post.getAll.useQuery();
};

export default usePosts;
