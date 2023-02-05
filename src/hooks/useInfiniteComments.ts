import { type RouterInputs, trpc } from "../utils/trpc";

const useInfiniteComments = ({
  input,
}: {
  input: RouterInputs["comment"]["infiniteComments"];
}) => {
  return trpc.comment.infiniteComments.useInfiniteQuery(
    {
      ...input,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );
};

export default useInfiniteComments;
