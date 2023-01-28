import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { sleep } from "../../utils";

type DropdownProps = {
  children: React.ReactNode;
  expandBtn?: React.ReactNode;
  className?: string;
  isProtected?: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({
  children,
  isProtected,
  className = "",
  expandBtn = <span className="">&#8942;</span>,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [animationClasses, setAnimationClasses] =
    useState("opacity-0 scale-75");

  const router = useRouter();

  const { data: session } = useSession();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdownMenu = useCallback(async () => {
    if (isProtected && !session) {
      router.push("/sign-in");
      return;
    }
    if (!isOpen) {
      setIsOpen(true);
      await sleep(10);
      setAnimationClasses("opacity-1 scale-1");
    } else {
      setAnimationClasses("opacity-0 scale-75");
      await sleep();
      setIsOpen(false);
    }
  }, [isOpen, isProtected, router, session]);

  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAnimationClasses("opacity-0 scale-75");
        await sleep();
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative ml-auto">
      <span
        className="flex select-none items-center rounded-lg py-1 px-3 text-2xl text-gray-800 transition-colors duration-300 hover:bg-[#e5e7eb] dark:text-gray-300 dark:hover:bg-[#1d2229]"
        role={"button"}
        onClick={toggleDropdownMenu}
      >
        {expandBtn}
      </span>
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
