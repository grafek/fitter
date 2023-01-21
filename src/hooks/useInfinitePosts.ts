import { POSTS_LIMIT } from "../utils/globals";
import { trpc } from "../utils/trpc";

const useInfinitePosts = () => {
  return trpc.post.infinitePosts.useInfiniteQuery(
    {
      limit: POSTS_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );
};

export default useInfinitePosts;
