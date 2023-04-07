import { signOut, useSession } from "next-auth/react";
import {
  AiOutlineHeart,
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineUnorderedList,
  AiOutlineUser,
} from "react-icons/ai";
import { RiUserFollowLine } from "react-icons/ri";
import { ProfilePicture, Dropdown } from "./";
import type { MouseEventHandler } from "react";
import type { IconType } from "react-icons/lib";
import Link from "next/link";
import { DropdownItem } from "./Dropdown";

const Navigation: React.FC = () => {
  const { data: sessionData } = useSession();

  const NAVIGATION = [
    {
      text: "Create a post",
      linkDestination: "/post/create",
      Icon: AiOutlinePlus,
      isProtected: true,
    },
    {
      text: "Show all posts",
      linkDestination: "/",
      Icon: AiOutlineUnorderedList,
    },
  ];
  const DROPDOWN_ITEMS = [
    {
      text: "My Posts",
      linkDestination: `/profile/${sessionData?.user?.id}/posts`,
      Icon: AiOutlineUnorderedList,
    },
    {
      text: "Liked Posts",
      linkDestination: `/profile/${sessionData?.user?.id}/liked-posts`,
      Icon: AiOutlineHeart,
    },
    {
      text: "Following",
      linkDestination: `/profile/${sessionData?.user?.id}/following`,
      Icon: AiOutlineUser,
    },
    {
      text: "My followers",
      linkDestination: `/profile/${sessionData?.user?.id}/followers`,
      Icon: RiUserFollowLine,
    },
    {
      text: "Sign out",
      Icon: AiOutlineLogout,
      onClick: () => signOut({ callbackUrl: "/" }),
    },
  ];

  const expandUserDropdown = (
    <>
      <ProfilePicture className="max-h-[32px] max-w-[32px]" />
      <svg viewBox="0 0 20 20" className="ml-1 h-4 w-4">
        <path d="M6 9l6 6 6-6" strokeWidth="2" stroke="currentColor" />
      </svg>
    </>
  );

  return (
    <nav className="flex items-center justify-around dark:bg-[#161b22]/70">
      {NAVIGATION.map((navItem, itemIndex) => (
        <NavItem
          key={itemIndex}
          isProtected={navItem.isProtected}
          Icon={navItem.Icon}
          innerSpanClasses="hidden md:block"
          linkDestination={navItem.linkDestination}
        >
          {navItem.text}
        </NavItem>
      ))}

      <Dropdown isProtected expandBtn={expandUserDropdown} className="w-62">
        <DropdownItem className="border-b border-gray-300 py-2 dark:border-gray-700">
          <NavItem linkDestination={`/profile/${sessionData?.user?.id}`}>
            <ProfilePicture className="max-h-[32px] max-w-[32px]" />
            <div className="flex flex-col">
              <span className="font-semibold">{sessionData?.user?.name}</span>
              <span className="text-sm text-gray-500">
                {sessionData?.user?.email}
              </span>
            </div>
          </NavItem>
        </DropdownItem>
        {DROPDOWN_ITEMS.map(
          ({ Icon, text, linkDestination, onClick }, itemIndex) => (
            <DropdownItem
              key={itemIndex}
              className={
                "border-gray-300 last:border-t last:pt-4 last:font-bold last:text-red-500 dark:border-gray-700"
              }
            >
              <NavItem
                linkDestination={linkDestination}
                onClick={onClick}
                Icon={Icon}
              >
                {text}
              </NavItem>
            </DropdownItem>
          )
        )}
      </Dropdown>
    </nav>
  );
};
export default Navigation;

type NavItemProps = {
  Icon?: IconType;
  children?: React.ReactNode;
  linkDestination?: string;
  innerSpanClasses?: string;
  linkClasses?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  iconSize?: string;
  iconColor?: string;
  isProtected?: boolean;
};

export const NavItem: React.FC<NavItemProps> = ({
  Icon,
  children,
  linkDestination,
  innerSpanClasses = "",
  linkClasses = "",
  onClick,
  iconSize = "1.5rem",
  iconColor = "inherit",
  isProtected = false,
}) => {
  const navItemClasses =
    "flex w-full duration-300 dark:hover:text-white dark:hover:bg-[#1d2229] rounded-lg items-center gap-2 py-1 px-2 hover:bg-[#e5e7eb]";
  const navTextClasses = `w-full flex items-center gap-2`;

  const { data: session } = useSession();

  return linkDestination ? (
    <Link
      shallow={true}
      href={isProtected && !session?.user ? "/auth/sign-in" : linkDestination}
      className={`${navItemClasses} ${linkClasses}`}
    >
      {Icon ? <Icon size={iconSize} color={iconColor} /> : null}
      {children ? (
        <span className={`${navTextClasses} ${innerSpanClasses}`}>
          {children}
        </span>
      ) : null}
    </Link>
  ) : (
    <button onClick={onClick} className={`${navItemClasses} ${linkClasses}`}>
      {Icon ? <Icon size={iconSize} color={iconColor} /> : null}
      {children ? (
        <span className={`${navTextClasses} ${innerSpanClasses}`}>
          {children}
        </span>
      ) : null}
    </button>
  );
};
