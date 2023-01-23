import Link from "next/link";
import { type IconType } from "react-icons/lib";

type IconLinkProps = {
  Icon: IconType;
  iconSize?: string;
  iconColor?: string;
  href: string;
};

const IconLink: React.FC<IconLinkProps> = ({
  Icon,
  iconSize = "1.5rem",
  iconColor,
  href,
}) => {
  return (
    <Link
      href={href}
      className="mx-auto flex items-center justify-center gap-2"
    >
      <Icon size={iconSize} color={iconColor} />
    </Link>
  );
};

export default IconLink;
