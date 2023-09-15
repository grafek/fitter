import type { RouterInputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";

const useFollowers = ({
  input,
  enabled,
}: {
  input: RouterInputs["follow"]["getFollowing"];
  enabled?: boolean;
}) => {
  return trpc.follow.getFollowing.useQuery(
    { ...input },
    {
      enabled,
    },
  );
};

export default useFollowers;
