import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { type IconType } from "react-icons/lib";

type NavLinkProps = {
  MobileIcon: IconType;
  children: React.ReactNode;
  linkDestination: string;
  innerSpanClasses?: string;
  linkClasses?: string;
  isProfilePicture?: boolean;
};

const NavLink = ({
  MobileIcon,
  children,
  linkDestination,
  innerSpanClasses,
  isProfilePicture,
  linkClasses,
}: NavLinkProps) => {
  const { data: sessionData } = useSession();

  const navLinkClasses = "h-13 flex w-[80px] flex-col items-center md:w-fit";
  const navItemClasses =
    "text-xs transition-colors duration-300 md:px-2 md:text-base md:dark:hover:text-white md:dark:hover:bg-[#21262d]  py-1 rounded-lg md:hover:bg-[#e5e7eb]";

  return (
    <Link href={linkDestination} className={`${linkClasses} ${navLinkClasses}`}>
      {isProfilePicture ? (
        <div className="relative min-h-[24px] min-w-[24px] md:h-[35px] md:w-[35px]">
          <Image
            alt="user-pic"
            fill
            className="rounded-full object-contain"
            src={
              sessionData?.user
                ? (sessionData?.user.image as string)
                : "/user.png"
            }
            sizes="40x40"
          />
        </div>
      ) : (
        <MobileIcon className="text-2xl md:hidden " />
      )}
      <span className={`${navItemClasses} ${innerSpanClasses}`}>
        {children}
      </span>
    </Link>
  );
};

export default NavLink;
