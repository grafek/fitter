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
}

const Button = ({
  buttonColor,
  className = "",
  children,
  ...props
}: ButtonProps) => {
  let colorClasses: string;
  switch (buttonColor) {
    case "primary":
      colorClasses =
        "bg-[#3366ff] text-white hover:bg-transparent hover:text-[#3366ff] outline-[#3366ff]";
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
        "bg-[#ffcc00] hover:bg-transparent hover:text-[#ffcc00] outline-[#ffcc00]";
      break;
    case "google":
      colorClasses =
        "text-gray-500 transition-colors hover:outline-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:outline-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500";
      break;
    case "discord":
      colorClasses =
        "text-gray-500 transition-colors hover:outline-gray-400 hover:bg-indigo-400 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:outline-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500";
      break;
    default:
      colorClasses = "";
  }

  return (
    <button
      {...props}
      className={`rounded-md px-4 py-2 font-semibold shadow-md outline outline-1 transition-colors duration-200 disabled:opacity-50 ${colorClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
