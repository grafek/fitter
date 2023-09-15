import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import { sleep } from "../../utils";

type ModalProps = {
  hideModal: () => void;
  children: React.ReactNode;
  actionTitle: string;
  isOpen: boolean;
};

const MODAL_HIDDEN_CLASSES = "-translate-y-20 opacity-0 scale-75";
const MODAL_VISIBLE_CLASSES = "opacity-100 translate-y-0 scale-100";

const Modal: React.FC<ModalProps> = ({
  hideModal,
  isOpen,
  children,
  actionTitle,
}) => {
  const [mounted, setMounted] = useState(false);

  const [animations, setAnimations] = useState<string>(MODAL_HIDDEN_CLASSES);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      setTimeout(() => setAnimations(MODAL_VISIBLE_CLASSES), 10);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const portalDiv = document.getElementById("overlays") as HTMLElement;

  const modalContent = (
    <div
      id="backdrop"
      onClick={async () => {
        setAnimations(MODAL_HIDDEN_CLASSES);
        await sleep();
        hideModal();
      }}
      className="fixed z-[100] flex h-full w-full items-center justify-center bg-black/50"
    >
      <div
        id="modal"
        onClick={(e) => e.stopPropagation()}
        className={`${animations} fixed z-40 flex min-h-[150px] w-3/4 max-w-xl flex-1 flex-col gap-8 rounded-md bg-[#d9e0f8e7] p-4 text-black transition-all  duration-500 dark:bg-gray-900 dark:text-white`}
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
            {actionTitle}
          </h2>
          <button>
            <AiOutlineClose
              onClick={async () => {
                setAnimations(MODAL_HIDDEN_CLASSES);
                await sleep(500);
                hideModal();
              }}
              className="text-2xl text-red-600 transition-transform duration-300 hover:scale-110 md:text-3xl"
            />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
  return createPortal(modalContent, portalDiv);
};

export default Modal;
