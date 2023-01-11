interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: "danger" | "success" | "primary" | "warning";
  children: React.ReactNode;
  className?: string;
}

const Button = ({ color, className = "", children, ...props }: ButtonProps) => {
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
      className={`rounded-md px-4 py-2 font-semibold text-white shadow-md outline outline-1 transition-colors duration-200 disabled:opacity-50 ${colorClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
