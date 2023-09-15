import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useCallback, useRef, useState } from "react";
import { useClickOutside } from "../../hooks";
import { sleep } from "../../utils";

type DropdownProps = {
  children: React.ReactNode;
  expandBtn?: React.ReactNode;
  className?: string;
  isProtected?: boolean;
};

const DROPDOWN_HIDDEN_CLASSES = "opacity-0 scale-75 -translate-y-10";
const DROPDOWN_VISIBLE_CLASSES = "opacity-1 scale-1";

const Dropdown: React.FC<DropdownProps> = ({
  children,
  isProtected,
  className = "",
  expandBtn = "⋮",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [animationClasses, setAnimationClasses] = useState(
    DROPDOWN_HIDDEN_CLASSES,
  );

  const router = useRouter();

  const { data: session } = useSession();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdownMenu = useCallback(async () => {
    if (isProtected && !session) {
      router.push("/auth/sign-in");
      return;
    }
    if (!isOpen) {
      setIsOpen(true);
      await sleep(10);
      setAnimationClasses(DROPDOWN_VISIBLE_CLASSES);
    } else {
      setAnimationClasses(DROPDOWN_HIDDEN_CLASSES);
      await sleep();
      setIsOpen(false);
    }
  }, [isOpen, isProtected, router, session]);

  useClickOutside(dropdownRef, async () => {
    setAnimationClasses(DROPDOWN_HIDDEN_CLASSES);
    await sleep();
    setIsOpen(false);
  });

  return (
    <div ref={dropdownRef} className="relative ml-auto">
      <button
        className="flex select-none items-center rounded-lg px-3 py-1 text-2xl text-gray-800 transition-colors duration-300 hover:bg-[#e5e7eb] dark:text-gray-300 dark:hover:bg-[#1d2229]"
        role={"button"}
        onClick={toggleDropdownMenu}
      >
        {expandBtn}
      </button>
      {isOpen ? (
        <ul
          className={`${className} ${animationClasses} absolute -right-1 top-12 z-10 flex min-w-[4rem] select-none flex-col items-center rounded-md bg-[#f6f8fade] p-1 shadow-xl transition-all duration-300 dark:bg-[#1e2630ea] [&>*]:py-2`}
        >
          {children}
        </ul>
      ) : null}
    </div>
  );
};

export default Dropdown;

type DropdownItemProps = {
  children: React.ReactNode;
  className?: string;
};

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  className = "",
}) => {
  return <li className={`${className} w-full p-1`}>{children}</li>;
};
