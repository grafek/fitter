import { useSession } from "next-auth/react";
import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";
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
    {
      text: "My profile",
      linkDestination: sessionData?.user
        ? `/profile/${sessionData?.user.id}`
        : "/sign-in",
      isProfilePicture: true,
      innerSpanClasses: "md:hidden",
    },
  ];

  return (
    <nav className="fixed left-0 bottom-0 z-10 flex w-full items-center justify-around bg-[#f6f8fa]/70 pt-2 pb-1 dark:bg-[#161b22]/70 md:static md:w-fit md:gap-4 md:bg-transparent md:py-0 md:px-0">
      {NAVIGATION.map((navItem, itemIndex) => {
        return (
          <NavLink
            key={itemIndex}
            MobileIcon={navItem.MobileIcon}
            linkDestination={navItem.linkDestination}
            isProfilePicture={navItem.isProfilePicture}
            innerSpanClasses={navItem.innerSpanClasses}
          >
            {navItem.text}
          </NavLink>
        );
      })}
    </nav>
  );
};
export default Navigation;
