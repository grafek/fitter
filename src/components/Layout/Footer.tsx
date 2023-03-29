const Footer: React.FC = () => {
  return (
    <footer
      className={`flex h-12 items-center justify-center bg-[#f6f8fa] dark:bg-[#161b22]/70`}
    >
      <a href="https://github.com/grafek" target={"_blank"} rel="noreferrer">
        ©{new Date().getFullYear()} Jacek Grafender
      </a>
    </footer>
  );
};

export default Footer;
