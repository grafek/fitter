import { trpc } from "../utils/trpc";

const usePostById = ({ postId }: { postId: string}) => {
  return trpc.post.getById.useQuery(
    { postId },
    { refetchOnWindowFocus: false }
  );
};

export default usePostById;
