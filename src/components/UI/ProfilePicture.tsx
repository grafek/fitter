import { useSession } from "next-auth/react";
import Image from "next/image";
import { env } from "../../env/client.mjs";

type ProfilePictureProps = {
  imageSrc?: string;
  className?: string;
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  imageSrc,
  className,
}) => {
  const { data: session } = useSession();

  const altImg = session?.user
    ? (session?.user.image as string)
    : `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${env.NEXT_PUBLIC_SUPABASE_BUCKET}/assets/user.png`;
  return (
    <div
      className={`relative flex h-[38px] w-[38px] select-none flex-col justify-center ${className}`}
    >
      <Image
        alt="Profile Picture"
        fill
        className="rounded-full object-contain"
        src={imageSrc || altImg}
        sizes="40x40"
      />
    </div>
  );
};

export default ProfilePicture;
