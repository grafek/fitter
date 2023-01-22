import { type RouterInputs, trpc } from "../utils/trpc";

const usePostById = ({
  input,
}: {
  input: RouterInputs["post"]["infinitePosts"];
}) => {
  return trpc.post.infinitePosts.useInfiniteQuery({
    ...input,
  });
};

export default usePostById;
