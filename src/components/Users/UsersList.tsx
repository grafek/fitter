import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import { useFollowers } from "../../hooks";
import UserItem from "./UserItem";

type UsersListProps = { users: User[] | undefined };

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  const { data: session } = useSession();

  const { data: followingIds } = useFollowers({
    input: {
      userId: session?.user?.id ?? "",
    },
  });
  let isFollowing: boolean;

  return (
    <ul className="mx-auto mt-5 flex flex-col divide-y-[1px] rounded-lg p-4 shadow-md dark:divide-slate-700">
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

export default UsersList;
