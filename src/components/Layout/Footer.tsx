import { useSession } from "next-auth/react";

function Footer() {
  const currYear = new Date().getFullYear();

  const { data: session } = useSession();

  return (
    <footer
      className={`flex h-12 items-center justify-center bg-[#ffc3c3] md:mb-0 ${
        !session ? "mb-0" : "mb-[60px]"
      }`}
    >
      <a
        href="https://github.com/grafek"
        target={"_blank"}
        rel="noreferrer"
        className=""
      >
        ©{currYear} Jacek Grafender
      </a>
    </footer>
  );
}

export default Footer;
