import { trpc } from "../utils/trpc";

const useFindUser = ({ userId }: { userId: string | undefined | string[] }) => {
  if (typeof userId !== "string") {
    throw new Error("Wrong input!");
  }
  return trpc.user.getUserById.useQuery({ userId });
};

export default useFindUser;
