import { useSession } from "next-auth/react";
import { useFollow, useUnfollow } from "../../hooks";
import { Button } from "./";

type FollowBtnProps = {
  followingId: string;
  isFollowing: boolean;
  followText?: string;
  followingText?: string;
};

const FollowBtn: React.FC<FollowBtnProps> = ({
  followingId,
  isFollowing,
  followText = "Follow",
  followingText = "Following",
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
          disabled={unfollowLoading || followLoading}
          className="min-w-[87px] py-1 px-2 dark:hover:bg-blue-400 dark:hover:outline-blue-400"
        >
          {isFollowing ? followingText : followText}
        </Button>
      ))
    : null;

  return btnContent;
};

export default FollowBtn;
