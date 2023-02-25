import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FollowBtn } from "../Layout";

type UserItemProps = {
  userId: string;
  userName: string;
  userImage: string;
  isFollowing?: boolean;
};

const UserItem: React.FC<UserItemProps> = ({
  userId,
  userName,
  userImage,
  isFollowing,
}) => {
  const { data: session } = useSession();

  const checkUser = userId === session?.user?.id;

  return (
    <li className="flex flex-col items-center justify-between sm:flex-row">
      <Link
        className="flex items-center gap-3 py-4 transition-colors hover:text-slate-500"
        href={`/profile/${userId}`}
      >
        <div className="relative h-12 min-h-[3rem] w-12 min-w-[3rem]">
          <Image
            alt={`${userName}'s picture`}
            fill
            className="rounded-full object-contain"
            src={userImage || "/user.png"}
            sizes="40x40"
          />
        </div>
        <h2 className="text-xl font-semibold md:text-2xl">{userName}</h2>
      </Link>
      {!checkUser ? (
        <FollowBtn followingId={userId} isFollowing={isFollowing ?? false} />
      ) : null}
    </li>
  );
};

export default UserItem;
