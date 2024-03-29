import type { Post } from "@prisma/client";
import type { InfiniteQueryObserverResult } from "@tanstack/react-query";
import { useEffect } from "react";

type useInfiniteScrollProps = {
  fetchNextPage: () => Promise<
    InfiniteQueryObserverResult<{
      posts: Post[];
      nextCursor: string | undefined | null;
    }>
  >;
  hasNextPage: boolean | undefined;
};

const useInfiniteScroll = ({
  fetchNextPage,
  hasNextPage,
}: useInfiniteScrollProps) => {
  useEffect(() => {
    function handleScroll() {
      if (
        Math.ceil(window.innerHeight + document.documentElement.scrollTop) !==
        document.documentElement.offsetHeight
      )
        return;
      if (hasNextPage) fetchNextPage();
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage]);
};

export default useInfiniteScroll;
