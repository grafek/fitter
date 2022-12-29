import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  AiOutlinePlus,
  AiOutlineUnorderedList,
  AiOutlineUser,
} from "react-icons/ai";

function Navigation() {
  const { data: sessionData } = useSession();

  //   if (!sessionData) return null;

  return (
    <div className="fixed left-0 bottom-0 z-10 flex w-full items-center justify-around gap-4 bg-[#f5d2d2]/80 px-10 py-2 md:static md:w-fit md:gap-4 md:bg-transparent md:py-0 md:px-0">
      <Link href={"/create-post"} className="flex flex-col items-center ">
        <AiOutlinePlus className="text-3xl md:hidden " />
        <span className="text-xs md:text-base">Create a post</span>
      </Link>
      <Link href={"/"} className="flex flex-col items-center ">
        <AiOutlineUnorderedList className="text-3xl md:hidden" />
        <span className="text-xs md:text-base">Show all posts</span>
      </Link>

      <Link href={"/my-profile"} className="flex flex-col items-center ">
        <AiOutlineUser className="text-3xl md:hidden" />
        <span className="text-xs md:text-base">My profile</span>
      </Link>
    </div>
  );
}
export default Navigation;
