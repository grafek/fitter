import { trpc } from "../utils/trpc";

const useInfinitePosts = ({ postsPerPage }: { postsPerPage: number }) => {
  return trpc.post.infinitePosts.useInfiniteQuery(
    {
      limit: postsPerPage,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );
};

export default useInfinitePosts;
