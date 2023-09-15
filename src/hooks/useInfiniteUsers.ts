import { type RouterInputs, trpc } from "../utils/trpc";

const useInfiniteUsers = ({
  input,
  enabled,
}: {
  input: RouterInputs["user"]["infiniteUsers"];
  enabled?: boolean;
}) => {
  return trpc.user.infiniteUsers.useInfiniteQuery(
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

export default useInfiniteUsers;
