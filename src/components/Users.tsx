import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { memo } from "react";
import { useFollowers } from "../hooks";
import Image from "next/image";
import Link from "next/link";
import { FollowBtn } from "./UI";
import { UserSkeleton } from "./UI/Skeletons";

type UsersProps = { users: User[] | undefined; isLoading: boolean };

const Users: React.FC<UsersProps> = ({ users, isLoading }) => {
  const { data: session } = useSession();

  const { data: followingIds } = useFollowers({
    input: {
      userId: session?.user?.id ?? "",
    },
  });
  let isFollowing: boolean;

  return (
    <ul className="mt-5 flex flex-col rounded-lg p-4">
      {isLoading
        ? Array(2)
            .fill(1)
            .map((_, i) => <UserSkeleton key={i} />)
        : null}
      {(!users || users.length < 1) && !isLoading ? (
        <h2 className="p-2 text-center font-semibold">So empty... 😶</h2>
      ) : null}
      {users?.map((user) => {
        if (followingIds?.includes(user.id)) {
          isFollowing = true;
        } else {
          isFollowing = false;
        }
        const checkUser = user.id === session?.user?.id;

        return (
          <li
            className="flex flex-col items-center justify-between border-b-[1px] last:border-none dark:border-slate-700 sm:flex-row"
            key={user.id}
          >
            <Link
              className="flex items-center gap-3 py-4 transition-colors hover:text-slate-500"
              href={`/profile/${user.id}`}
            >
              <div className="relative h-12 min-h-[3rem] w-12 min-w-[3rem]">
                <Image
                  alt={`${user.name}'s picture`}
                  fill
                  className="rounded-full object-contain"
                  src={user.image || "/user.png"}
                  sizes="40x40"
                />
              </div>
              <h2 className="text-xl font-semibold md:text-2xl">{user.name}</h2>
            </Link>
            {!checkUser ? (
              <FollowBtn
                followingId={user.id}
                isFollowing={isFollowing ?? false}
                className="mb-4 sm:mb-0"
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};

export default memo(Users);
