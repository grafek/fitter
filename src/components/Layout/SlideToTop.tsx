import { useState, useEffect } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import { Button } from "./";

const SlideToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (window.pageYOffset > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
    return;
  };

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isVisible && (
        <Button
          className="fixed bottom-8 right-8 z-50 bg-gray-200 p-2 text-black outline-indigo-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          onClick={handleClick}
        >
          <AiOutlineArrowUp />
        </Button>
      )}
    </>
  );
};

export default SlideToTop;
