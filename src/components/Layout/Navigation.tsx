import { signOut, useSession } from "next-auth/react";
import {
  AiOutlineHeart,
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineUnorderedList,
  AiOutlineUser,
} from "react-icons/ai";
import { RiUserFollowLine } from "react-icons/ri";
import { NavItem, ProfilePicture, Dropdown, DropdownItem, ArrowDown } from "./";

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
      <ArrowDown className="ml-1 h-4 w-4" />
    </>
  );

  return (
    <nav>
      <div className="flex w-full items-center justify-around dark:bg-[#161b22]/70 ">
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
      </div>
    </nav>
  );
};
export default Navigation;
