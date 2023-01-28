import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { type MouseEventHandler } from "react";
import { type IconType } from "react-icons/lib";

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

const NavItem: React.FC<NavItemProps> = ({
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
      href={isProtected && !session?.user ? "/sign-in" : linkDestination}
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

export default NavItem;
