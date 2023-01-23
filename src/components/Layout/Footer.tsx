const Footer: React.FC = () => {
  const currYear = new Date().getFullYear();

  return (
    <footer
      className={`flex h-12 items-center justify-center bg-[#f6f8fa] dark:bg-[#161b22]/70 
      `}
    >
      <a href="https://github.com/grafek" target={"_blank"} rel="noreferrer">
        ©{currYear} Jacek Grafender
      </a>
    </footer>
  );
};

export default Footer;
