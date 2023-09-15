import type { InferGetStaticPropsType, NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FollowBtn, PageHeading } from "../../../components/ui";
import { useFollowers, useUserById } from "../../../hooks";
import { type DehydratedState } from "@tanstack/react-query";
import {
  AiOutlineHeart,
  AiOutlineUnorderedList,
  AiOutlineUser,
} from "react-icons/ai";
import { RiUserFollowLine } from "react-icons/ri";
import { withProfileId, withProfilePaths } from "../../../hoc";
import { NavItem } from "../../../components/ui/Navigation";
import HeadSEO from "../../../components/layout/HeadSEO";
import { METADATA } from "../../../utils/globals";

type ProfilePageProps = { trpcState: DehydratedState; profileId: string };

const ProfilePage: NextPage<ProfilePageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { profileId } = props;

  const { data: session } = useSession();
  const { data: foundUser } = useUserById({ userId: profileId });
  const { data: followingIds } = useFollowers({
    input: {
      userId: session?.user?.id ?? "",
    },
  });
  const isFollowing = followingIds?.includes(profileId);

  const loggedUserPage = profileId === session?.user?.id;

  const profileHeading = loggedUserPage
    ? "My Profile"
    : `${foundUser?.name}'s profile`;

  const profilePosts = loggedUserPage
    ? "My posts"
    : `${foundUser?.name}'s posts`;

  const likedPosts = loggedUserPage
    ? "My liked posts"
    : `${foundUser?.name}'s liked posts`;
  const following = loggedUserPage
    ? "People who I follow"
    : `People who ${foundUser?.name} follows`;
  const followers = loggedUserPage
    ? "People who follow me"
    : `People who follow ${foundUser?.name}`;

  const LINKS = [
    {
      text: profilePosts,
      linkDestination: `/profile/${profileId}/posts`,
      Icon: AiOutlineUnorderedList,
    },
    {
      text: likedPosts,
      linkDestination: `/profile/${profileId}/liked-posts`,
      Icon: AiOutlineHeart,
    },
    {
      text: following,
      linkDestination: `/profile/${profileId}/following`,
      Icon: AiOutlineUser,
    },
    {
      text: followers,
      linkDestination: `/profile/${profileId}/followers`,
      Icon: RiUserFollowLine,
    },
    {
      text: "Check posts from your followers!",
      linkDestination: `/profile/${profileId}/following-posts`,
      Icon: AiOutlineUnorderedList,
    },
    {
      text: " Check posts from people you follow!",
      Icon: AiOutlineUnorderedList,
      linkDestination: `/profile/${profileId}/following-posts`,
    },
  ];

  if (!loggedUserPage) {
    LINKS.length = 4;
  }

  return (
    <>
      <HeadSEO
        canonicalUrl={`${METADATA.siteUrl}/${profileId}/`}
        description={profileHeading}
        title={profileHeading}
      />
      <PageHeading>{profileHeading}</PageHeading>
      <section className="mx-auto mt-5 flex flex-col items-center justify-center gap-4 rounded-lg p-6 pb-2 shadow-md">
        <div className="relative h-24 w-24">
          <Image
            alt="user-pic"
            fill
            className="rounded-full object-contain"
            src={foundUser?.image || "/user.png"}
            sizes="40x40"
          />
        </div>
        <h2 className="text-2xl font-semibold">{foundUser?.name}</h2>
        {!loggedUserPage ? (
          <FollowBtn
            followingId={profileId}
            isFollowing={isFollowing ?? false}
          />
        ) : null}

        <ul className="w-full divide-y-[1px] divide-slate-200 dark:divide-slate-700">
          {LINKS.map(({ Icon, text, linkDestination }, itemIndex) => (
            <li key={itemIndex} className="w-full py-2">
              <NavItem linkDestination={linkDestination} Icon={Icon}>
                {text}
              </NavItem>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default ProfilePage;

export const getStaticProps = withProfileId(async () => {
  return { props: {} };
});

export const getStaticPaths = withProfilePaths();
