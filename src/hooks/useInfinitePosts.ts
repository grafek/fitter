import { type RouterInputs, trpc } from "../utils/trpc";

const useInfinitePosts = ({
  input,
}: {
  input: RouterInputs["post"]["infinitePosts"];
}) => {
  return trpc.post.infinitePosts.useInfiniteQuery(
    {
      ...input,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );
};

export default useInfinitePosts;
