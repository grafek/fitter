import type { RouterInputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";

const useUsers = ({
  input,
  enabled,
}: {
  input: RouterInputs["user"]["getAll"];
  enabled?: boolean;
}) => {
  return trpc.user.getAll.useQuery(
    { ...input },
    {
      enabled,
      refetchOnWindowFocus: false,
    },
  );
};

export default useUsers;
