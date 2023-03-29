import { trpc } from "../utils/trpc";

const useUserById = ({ userId }: { userId: string }) => {
  return trpc.user.getUserById.useQuery(
    { userId },
    { refetchOnWindowFocus: false, suspense: true }
  );
};

export default useUserById;
