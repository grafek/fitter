import { trpc } from "../utils/trpc";

const useUsers = () => {
  return trpc.auth.getUsers.useQuery();
};

export default useUsers;
