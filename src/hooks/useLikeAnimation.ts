import { useCallback, useState } from "react";
import { sleep } from "../utils";

type useLikeAnimationProps = {
  hasLiked:
    | {
        userId: string;
      }
    | undefined;
};

const useLikeAnimation = ({ hasLiked }: useLikeAnimationProps) => {
  const [animationClasses, setAnimationClasses] = useState<string>();
  const likeAnimation = useCallback(async () => {
    if (!hasLiked) {
      setAnimationClasses("animate-push");
      await sleep(300);
      setAnimationClasses("");
    }
  }, [hasLiked]);

  return { animationClasses, likeAnimation };
};

export default useLikeAnimation;
