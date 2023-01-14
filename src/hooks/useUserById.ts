import { trpc } from "../utils/trpc";

const useUserById = ({ userId }: { userId: string | undefined | string[] }) => {
  if (typeof userId !== "string") {
    throw new Error("Wrong input!");
  }
  return trpc.user.getUserById.useQuery(
    { userId },
    { refetchOnWindowFocus: false }
  );
};

export default useUserById;
