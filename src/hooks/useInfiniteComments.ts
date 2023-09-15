import { type RouterInputs, trpc } from "../utils/trpc";

const useInfiniteComments = ({
  input,
  enabled,
}: {
  input: RouterInputs["comment"]["infiniteComments"];
  enabled?: boolean;
}) => {
  return trpc.comment.infiniteComments.useInfiniteQuery(
    {
      ...input,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      enabled,
    },
  );
};

export default useInfiniteComments;
