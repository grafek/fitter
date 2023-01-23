type DropdownItemProps = {
  children: React.ReactNode;
};

const DropdownItem: React.FC<DropdownItemProps> = ({ children }) => {
  return <li className="flex justify-center">{children}</li>;
};

export default DropdownItem;
