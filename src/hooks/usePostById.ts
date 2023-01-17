import { trpc } from "../utils/trpc";

const usePostById = ({ postId }: { postId: string | undefined | string[] }) => {
  if (typeof postId !== "string") {
    throw new Error("Wrong input!");
  }
  return trpc.post.getById.useQuery(
    { postId },
    { refetchOnWindowFocus: false }
  );
};

export default usePostById;
