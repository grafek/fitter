import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { memo } from "react";
import { useFollowers } from "../../hooks";
import { Loading } from "../Layout";
import UserItem from "./UserItem";

type UsersListProps = { users: User[] | undefined; isLoading: boolean };

const UsersList: React.FC<UsersListProps> = ({ users, isLoading }) => {
  const { data: session } = useSession();

  const { data: followingIds } = useFollowers({
    input: {
      userId: session?.user?.id ?? "",
    },
  });
  let isFollowing: boolean;

  if (isLoading) {
    return <Loading />;
  }

  if (!users || users.length < 1) {
    return <h2 className="p-2 text-center font-semibold">So empty... 😶</h2>;
  }

  return (
    <ul className=" mt-5 flex flex-col divide-y-[1px] rounded-lg p-4 shadow-md dark:divide-slate-700">
      {users?.map((user) => {
        if (followingIds?.includes(user.id)) {
          isFollowing = true;
        } else {
          isFollowing = false;
        }
        return (
          <UserItem
            userId={user.id}
            userImage={user.image}
            isFollowing={isFollowing}
            userName={user.name}
            key={user.id}
          />
        );
      })}
    </ul>
  );
};

export default memo(UsersList);
