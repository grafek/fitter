import { useSession } from "next-auth/react";
import Image from "next/image";
import { env } from "../../env/client.mjs";

const ProfilePicture: React.FC = () => {
  const { data: session } = useSession();
  return (
    <div className="relative flex min-h-[32px] min-w-[32px] flex-col justify-center">
      <Image
        alt="Profile Picture"
        fill
        className="rounded-full object-contain"
        src={
          session?.user
            ? (session?.user.image as string)
            : `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${env.NEXT_PUBLIC_SUPABASE_BUCKET}/assets/user.png`
        }
        sizes="40x40"
      />
    </div>
  );
};

export default ProfilePicture;
