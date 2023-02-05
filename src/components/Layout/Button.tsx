export type ButtonColor =
  | "danger"
  | "success"
  | "primary"
  | "warning"
  | "google"
  | "discord";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonColor?: ButtonColor;
  children: React.ReactNode;
  className?: string;
  isRounded?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  buttonColor,
  className = "",
  children,
  isRounded,
  ...props
}) => {
  let colorClasses: string;
  switch (buttonColor) {
    case "primary":
      colorClasses =
        "bg-[#3366ff] px-3 py-1 md:px-4 md:py-2 hover:bg-transparent hover:text-[#3366ff] outline-[#3366ff]";
      break;
    case "success":
      colorClasses =
        "bg-[#00994d] px-3 py-1 md:px-4 md:py-2 hover:bg-transparent hover:text-[#00994d] outline-[#00994d]";
      break;
    case "danger":
      colorClasses =
        "bg-[#e60000] px-3 py-1 md:px-4 md:py-2 hover:bg-transparent hover:text-[#e60000] outline-[#e60000]";
      break;
    case "warning":
      colorClasses =
        "bg-[#ffcc00] px-3 py-1 md:px-4 md:py-2 hover:bg-transparent hover:text-[#ffcc00]  outline-[#ffcc00]";
      break;
    case "google":
      colorClasses =
        "text-gray-500 px-3 py-1 md:px-4 md:py-2 transition-colors hover:outline-gray-400 hover:bg-gray-100 hover:text-black";
      break;
    case "discord":
      colorClasses =
        "text-gray-500 px-3 py-1 md:px-4 md:py-2 transition-colors hover:outline-indigo-400 hover:bg-indigo-400";
      break;
    default:
      colorClasses = "";
  }

  return (
    <button
      {...props}
      className={`select-none font-semibold shadow-md outline outline-1 transition-colors duration-200 disabled:opacity-50 dark:text-white ${
        isRounded ? "rounded-full" : "rounded-md"
      } ${colorClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
