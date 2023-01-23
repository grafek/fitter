import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";
import Dropdown from "./Dropdown";
import DropdownItem from "./DropdownItem";
import NavLink from "./NavLink";

const Navigation: React.FC = () => {
  const { data: sessionData } = useSession();

  const NAVIGATION = [
    {
      text: "Create a post",
      linkDestination: "/post/create",
      MobileIcon: AiOutlinePlus,
    },
    {
      text: "Show all posts",
      linkDestination: "/",
      MobileIcon: AiOutlineUnorderedList,
    },
  ];
  const DROPDOWN_ITEMS = [
    {
      text: "My Profile",
      linkDestination: `/profile/${sessionData?.user?.id}`,
    },
    {
      text: "My Posts",
      linkDestination: `/profile/${sessionData?.user?.id}/posts`,
    },
    {
      text: "Liked Posts",
      linkDestination: `/profile/${sessionData?.user?.id}/liked-posts`,
    },
  ];

  const profilePictureContent = (
    <div className="relative mr-8 flex min-h-[32px] min-w-[32px] flex-col justify-center md:h-[35px] md:w-[35px]">
      <Image
        alt="user-pic"
        fill
        className="rounded-full object-contain"
        src={
          sessionData?.user ? (sessionData?.user.image as string) : "/user.png"
        }
        sizes="40x40"
      />
      <svg className="absolute ml-10 h-4 w-4 fill-current " viewBox="0 0 24 24">
        <path
          d="M6 9l6 6 6-6"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
        />
      </svg>
    </div>
  );

  return (
    <nav>
      <div className="flex w-full items-center justify-around gap-6 dark:bg-[#161b22]/70 ">
        {NAVIGATION.map((navItem, itemIndex) => (
          <NavLink
            key={itemIndex}
            MobileIcon={navItem.MobileIcon}
            linkDestination={navItem.linkDestination}
          >
            {navItem.text}
          </NavLink>
        ))}

        <Dropdown expandBtn={profilePictureContent} className="w-32">
          {DROPDOWN_ITEMS.map((dropdownItem, itemIndex) => (
            <DropdownItem key={itemIndex}>
              <NavLink linkDestination={dropdownItem.linkDestination}>
                {dropdownItem.text}
              </NavLink>
            </DropdownItem>
          ))}
          <DropdownItem>
            <button
              className="rounded-lg px-2 font-semibold transition-colors duration-300 hover:bg-[#e5e7eb] dark:hover:bg-[#1d2229] dark:hover:text-white"
              onClick={() =>
                sessionData ? signOut({ callbackUrl: "/" }) : signIn()
              }
            >
              {sessionData ? "Sign out" : "Sign in"}
            </button>
          </DropdownItem>
        </Dropdown>
      </div>
    </nav>
  );
};
export default Navigation;
