import { useSession } from "next-auth/react";

function Footer() {
  const currYear = new Date().getFullYear();

  const { data: session } = useSession();

  return (
    <footer
      className={`flex h-12 items-center justify-center bg-[#f6f8fa] dark:bg-[#161b22]/70 md:mb-0 md:pb-0 ${
        !session ? "mb-0" : "pb-[100px]"
      }`}
    >
      <a
        href="https://github.com/grafek"
        target={"_blank"}
        rel="noreferrer"
        className="mt-10 md:mt-0"
      >
        ©{currYear} Jacek Grafender
      </a>
    </footer>
  );
}

export default Footer;
