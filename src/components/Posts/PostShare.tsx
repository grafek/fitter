import { useState } from "react";
import toast from "react-hot-toast";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HiClipboardCopy } from "react-icons/hi";
import { InstagramIcon, Modal } from "../Layout";

type PostShareProps = {
  postId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostShare: React.FC<PostShareProps> = ({ postId, isOpen, setIsOpen }) => {
  const [copied, setCopied] = useState(false);

  const postLink = `https://fitterr.vercel.app/post/${postId}`;

  const shareOnFacebook = () => {
    const url =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent(postLink);
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareOnTwitter = () => {
    const url =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent("Check out this post!") +
      "&url=" +
      encodeURIComponent(postLink);
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareOnLinkedIn = () => {
    const url =
      "https://www.linkedin.com/sharing/share-offsite/?url=" +
      encodeURIComponent(postLink);
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareOnInstagram = () => {
    const url =
      "https://www.instagram.com/?url=" + encodeURIComponent(postLink);
    window.open(url, "_blank", "width=550,height=420");
  };

  const copyToClipboard = () => {
    if (!copied) {
      navigator.clipboard.writeText(postLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <Modal
      actionTitle="Share Post"
      hideModal={() => setIsOpen(false)}
      isOpen={isOpen}
    >
      <div className="flex justify-center gap-4">
        <button
          onClick={shareOnFacebook}
          className="text-blue-600 transition-colors hover:text-blue-800 focus:outline-none"
        >
          <FaFacebook size={40} />
        </button>
        <button
          onClick={shareOnTwitter}
          className="text-blue-400 transition-colors hover:text-blue-500 focus:outline-none"
        >
          <FaTwitter size={40} />
        </button>
        <button
          onClick={shareOnLinkedIn}
          className="text-blue-800 transition-colors hover:text-blue-900 focus:outline-none"
        >
          <FaLinkedin size={40} />
        </button>
        <button
          onClick={shareOnInstagram}
          className=" transition-colors hover:text-blue-900 focus:outline-none"
        >
          <InstagramIcon />
        </button>
      </div>
      <div className="relative max-w-[500px]">
        <input
          type="text"
          value={postLink}
          readOnly
          className="w-full rounded-md border py-2 px-4 text-gray-600"
        />
        <button
          className="absolute right-0 top-0 bottom-0 rounded-md bg-blue-500 py-2 px-3 text-white"
          onClick={copyToClipboard}
        >
          <HiClipboardCopy size={20} />
        </button>
      </div>
    </Modal>
  );
};

export default PostShare;
