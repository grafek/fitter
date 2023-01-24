type DropdownItemProps = {
  children: React.ReactNode;
  className?: string;
};

const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  className = "",
}) => {
  return <li className={`${className} w-full p-1`}>{children}</li>;
};

export default DropdownItem;
