interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: "danger" | "success" | "primary" | "warning";
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const Button = ({
  color,
  className = "",
  children,
  onClick,
  ...props
}: ButtonProps) => {
  let colorClasses: string;
  switch (color) {
    case "primary":
      colorClasses =
        "bg-[#3366ff] hover:bg-transparent hover:text-[#3366ff] outline-[#3366ff]";
      break;
    case "success":
      colorClasses =
        "bg-[#00994d] hover:bg-transparent hover:text-[#00994d] outline-[#00994d]";
      break;
    case "danger":
      colorClasses =
        "bg-[#e60000] hover:bg-transparent hover:text-[#e60000] outline-[#e60000]";
      break;
    case "warning":
      colorClasses =
        "bg-[#3366ff] hover:bg-transparent hover:text-[#3366ff] outline-[#3366ff]";
      break;
  }

  return (
    <button
      {...props}
      onClick={onClick}
      className={`rounded-md p-3 py-1 text-white shadow-md outline outline-1 transition-colors duration-200 ${colorClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
