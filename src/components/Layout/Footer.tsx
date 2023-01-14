function Footer() {
  const currYear = new Date().getFullYear();

  return (
    <footer
      className={`} flex h-12 items-center justify-center bg-[#f6f8fa] pb-[100px] dark:bg-[#161b22]/70 md:mb-0
      md:pb-0`}
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
