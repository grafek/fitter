type PageHeadingProps = {
  children: React.ReactNode;
  className?: string;
};

const PageHeading: React.FC<PageHeadingProps> = ({
  children,
  className = "",
}) => {
  return (
    <h1 className={`pb-4 text-xl font-semibold md:pb-8 ${className}`}>
      {children}
    </h1>
  );
};

export default PageHeading;
