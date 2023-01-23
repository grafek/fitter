import React, { useEffect, useRef, useState } from "react";
import { sleep } from "../../utils";

type DropdownProps = {
  children: React.ReactNode;
  expandBtn?: React.ReactNode;
  className?: string;
};

const Dropdown: React.FC<DropdownProps> = ({
  children,
  className = "",
  expandBtn = (
    <span className="p-2 px-4 text-2xl text-gray-800 dark:text-gray-300">
      &#8942;
    </span>
  ),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickedOutside, setClickedOutside] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdownMenu = async () => {
    setClickedOutside((prev) => !prev);
    if (!isOpen) {
      setIsOpen(true);
    } else {
      await sleep();
      setIsOpen(false);
    }
  };

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
      <button className="flex items-center" onClick={toggleDropdownMenu}>
        {expandBtn}
      </button>
      <ul
        className={`${
          !clickedOutside ? "scale-100 opacity-100" : "scale-75 opacity-0"
        } ${className} absolute -right-1 top-12 z-10 flex min-w-[4rem] flex-col items-center divide-y divide-slate-700 rounded-md py-1 shadow-md transition-all duration-200 dark:bg-[#1e2630cb] [&>*]:w-3/4 [&>*]:py-3`}
      >
        {isOpen ? children : null}
      </ul>
    </div>
  );
};

export default Dropdown;
