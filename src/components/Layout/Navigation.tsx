import { signIn, signOut, useSession } from "next-auth/react";
import {
  AiOutlineHeart,
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineUnorderedList,
} from "react-icons/ai";
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
      text: sessionData ? "Sign out" : "Sign in",
      Icon: AiOutlineLogout,
      onClick: () => (sessionData ? signOut({ callbackUrl: "/" }) : signIn()),
    },
  ];

  const expandUserDropdown = (
    <>
      <ProfilePicture />
      <ArrowDown className="ml-1 h-4 w-4" />
    </>
  );

  return (
    <nav>
      <div className="flex w-full items-center justify-around gap-4 dark:bg-[#161b22]/70 ">
        {NAVIGATION.map((navItem, itemIndex) => (
          <NavItem
            key={itemIndex}
            isProtected={navItem.isProtected}
            Icon={navItem.Icon}
            innerSpanClasses="hidden sm:block"
            linkDestination={navItem.linkDestination}
          >
            {navItem.text}
          </NavItem>
        ))}

        <Dropdown isProtected expandBtn={expandUserDropdown} className="w-60">
          <DropdownItem className="border-b border-gray-300 py-2 dark:border-gray-700">
            <NavItem linkDestination={`/profile/${sessionData?.user?.id}`}>
              <ProfilePicture />
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
