import { trpc } from "../utils/trpc";

const useUsers = () => {
  return trpc.user.getUsers.useQuery();
};

export default useUsers;
