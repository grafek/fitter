function Footer() {
  const currYear = new Date().getFullYear();

  return (
    <footer className="mb-[60px] flex h-12 items-center justify-center bg-[#ffc3c3] md:mb-0">
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
