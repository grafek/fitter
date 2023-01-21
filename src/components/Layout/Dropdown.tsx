import React, { useEffect, useRef, useState } from "react";
import { sleep } from "../../utils";

type DropdownProps = {
  children: React.ReactNode;
};

const Dropdown: React.FC<DropdownProps> = ({ children }) => {
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
    <div ref={dropdownRef} className="relative ml-auto md:mr-8">
      <button className="flex items-center" onClick={toggleDropdownMenu}>
        <span className="p-2 px-4 text-2xl text-gray-800 dark:text-gray-300">
          &#8942;
        </span>
      </button>
      <div
        className={`${
          !clickedOutside ? "scale-100 opacity-100" : "scale-75 opacity-0"
        } absolute -right-2 top-12 z-10 flex w-14 flex-col items-center gap-3 rounded-md py-3 shadow-md transition-all duration-200 dark:bg-slate-800/80 [&>*]:bg-[#3366ff] [&>*]:shadow`}
      >
        {isOpen ? children : null}
      </div>
    </div>
  );
};

export default Dropdown;
