import { type RouterInputs, trpc } from "../utils/trpc";

const useInfinitePosts = ({
  input,
  enabled,
}: {
  input: RouterInputs["post"]["infinitePosts"];
  enabled?: boolean;
}) => {
  return trpc.post.infinitePosts.useInfiniteQuery(
    {
      ...input,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      enabled,
      suspense: true,
    }
  );
};

export default useInfinitePosts;
