import { trpc } from "../utils/trpc";

type useUsersInfinitePostsProp = {
  userId: string | undefined | string[];
  postsPerPage: number;
};
const useUsersInfinitePosts = ({
  userId,
  postsPerPage,
}: useUsersInfinitePostsProp) => {
  if (typeof userId !== "string") {
    throw new Error("Wrong input!");
  }

  return trpc.post.infiniteUsersPosts.useInfiniteQuery(
    {
      userId,
      limit: postsPerPage,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );
};

export default useUsersInfinitePosts;
