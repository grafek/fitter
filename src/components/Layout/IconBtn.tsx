import { type MouseEventHandler } from "react";
import { type IconType } from "react-icons/lib";

type IconBtnProps = {
  Icon: IconType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  count?: number;
  iconSize?: string;
  iconColor?: string;
};

const IconBtn: React.FC<IconBtnProps> = ({
  Icon,
  onClick,
  count,
  iconSize = "1.5rem",
  iconColor,
}) => {
  return (
    <button
      className="mx-auto flex items-center justify-center gap-2"
      onClick={onClick}
    >
      <Icon size={iconSize} color={iconColor} />
      {count || count === 0 ? (
        <span className="text-sm text-gray-400">{count}</span>
      ) : null}
    </button>
  );
};

export default IconBtn;
