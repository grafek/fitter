type PageHeadingProps = {
  children: React.ReactNode;
  className?: string;
};

const PageHeading = ({ children, className = "" }: PageHeadingProps) => {
  return (
    <h1 className={`pb-4 md:pb-8 text-xl font-semibold md:text-2xl ${className}`}>
      {children}
    </h1>
  );
};

export default PageHeading;
