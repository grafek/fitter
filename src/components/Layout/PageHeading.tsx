type PageHeadingProps = {
  children: React.ReactNode;
  className?: string;
};

const PageHeading = ({ children, className = "" }: PageHeadingProps) => {
  return (
    <h1 className={`pb-4 text-lg md:text-2xl font-semibold ${className}`}>{children}</h1>
  );
};

export default PageHeading;
