import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";

function Navigation() {
  const { data: sessionData } = useSession();

  if (!sessionData || !sessionData.user) return null;

  return (
    <nav className="fixed left-0 bottom-0 z-10 flex w-full items-center justify-around gap-4 bg-[#f6f8fa]/70 dark:bg-[#161b22]/70 py-2 md:static md:w-fit md:gap-4 md:bg-transparent md:py-0 md:px-0">
      <Link href={"/post/create"} className="flex flex-col items-center">
        <AiOutlinePlus className="text-3xl md:hidden " />
        <span className="text-xs md:text-base">Create a post</span>
      </Link>
      <Link href={"/"} className="flex flex-col items-center ">
        <AiOutlineUnorderedList className="text-3xl md:hidden" />
        <span className="text-xs md:text-base">Show all posts</span>
      </Link>

      <div className="flex flex-col items-center">
        <Link
          href={`/profile/${sessionData.user.id}`}
          className="relative min-h-[30px] min-w-[30px] md:h-[35px] md:w-[35px]"
        >
          <Image
            alt="user-pic"
            fill
            className="rounded-full object-contain"
            src={sessionData.user.image || "/user.png"}
            sizes="40x40"
          />
        </Link>
        <span className="text-xs md:hidden">My profile</span>
      </div>
    </nav>
  );
}
export default Navigation;
