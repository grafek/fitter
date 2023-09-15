import { useSession } from "next-auth/react";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";
import { useFollow, useUnfollow } from "../../hooks";
import { Button } from ".";

type FollowBtnProps = {
  followingId: string;
  isFollowing: boolean;
  followText?: string;
  followingText?: string;
  className?: string;
};

const FollowBtn: React.FC<FollowBtnProps> = ({
  followingId,
  isFollowing,
  followText = "Follow",
  followingText = "Following",
  className = "",
}) => {
  const { mutate: follow, isLoading: followLoading } = useFollow();
  const { mutate: unfollow, isLoading: unfollowLoading } = useUnfollow();

  const { data: session } = useSession();
  let btnContent = null;

  session?.user
    ? (btnContent = (
        <Button
          onClick={() => {
            if (isFollowing) {
              unfollow({
                followerId: session?.user?.id ? session.user.id : "",
                followingId,
              });
            } else {
              follow({
                followerId: session?.user?.id ? session.user.id : "",
                followingId,
              });
            }
          }}
          buttonColor="primary"
          disabled={unfollowLoading || followLoading}
          className={`m-2 min-w-[109px] px-2 py-1 ${className}`}
        >
          <span className="flex items-center justify-center gap-1">
            {isFollowing ? (
              <>
                <AiOutlineCheck size={18} /> {followingText}
              </>
            ) : (
              <>
                <AiOutlinePlus size={18} /> {followText}
              </>
            )}
          </span>
        </Button>
      ))
    : null;

  return btnContent;
};

export default FollowBtn;
