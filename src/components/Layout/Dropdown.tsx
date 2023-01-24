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
  expandBtn = (
    <span className="p-2 px-4 text-2xl text-gray-800 dark:text-gray-300">
      &#8942;
    </span>
  ),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickedOutside, setClickedOutside] = useState(true);

  const router = useRouter();

  const { data: session } = useSession();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdownMenu = useCallback(async () => {
    if (isProtected && !session) {
      router.push("/sign-in");
      return;
    }
    setClickedOutside((prev) => !prev);
    if (!isOpen) {
      setIsOpen(true);
    } else {
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
        setClickedOutside(true);
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
    <div ref={dropdownRef} className="relative ml-auto px-2">
      <span
        className="flex items-center"
        role={"button"}
        onClick={toggleDropdownMenu}
      >
        {expandBtn}
      </span>
      <ul
        className={`${
          !clickedOutside ? "scale-100 opacity-100" : "scale-75 opacity-0"
        } ${className} absolute -right-1 top-12 z-10 flex min-w-[4rem] flex-col items-center rounded-md bg-[#f6f8fade] p-1 shadow-xl transition-all duration-200 dark:bg-[#1e2630ea] [&>*]:py-2`}
      >
        {isOpen ? children : null}
      </ul>
    </div>
  );
};

export default Dropdown;
