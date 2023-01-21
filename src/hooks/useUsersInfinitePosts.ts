import { POSTS_LIMIT } from "../utils/globals";
import { trpc } from "../utils/trpc";

const useUsersInfinitePosts = ({ creatorId }: { creatorId: string }) => {
  return trpc.post.infinitePosts.useInfiniteQuery(
    {
      creatorId,
      limit: POSTS_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );
};

export default useUsersInfinitePosts;
