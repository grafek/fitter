import Link from "next/link";
import React from "react";
import { type IconType } from "react-icons/lib";

type NavLinkProps = {
  MobileIcon?: IconType;
  children?: React.ReactNode;
  linkDestination: string;
  innerSpanClasses?: string;
  linkClasses?: string;
};

const NavLink: React.FC<NavLinkProps> = ({
  MobileIcon,
  children,
  linkDestination,
}) => {
  const navLinkClasses =
    "h-13 flex flex-col justify-center items-center md:w-fit";
  const navItemClasses = `${
    MobileIcon ? "hidden sm:flex" : ""
  } flex transition-colors px-2 py-1 duration-300 dark:hover:text-white dark:hover:bg-[#1d2229] rounded-lg hover:bg-[#e5e7eb]`;

  return (
    <Link href={linkDestination} className={`${navLinkClasses}`}>
      {MobileIcon ? <MobileIcon className="text-2xl sm:hidden " /> : null}
      <span className={`${navItemClasses}`}>{children}</span>
    </Link>
  );
};

export default NavLink;
