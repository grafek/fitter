import type { TRPCClientErrorBase } from "@trpc/client";
import type { DefaultErrorShape } from "@trpc/server";
import type { RouterInputs, RouterOutputs } from "../../utils/trpc";
import { memo } from "react";
import { CommentSkeleton } from "../ui/Skeletons";
import CommentItem from "./CommentItem";

type CommentsProps = {
  comments: RouterOutputs["comment"]["infiniteComments"]["comments"];
  input: RouterInputs["comment"]["infiniteComments"];
  error: TRPCClientErrorBase<DefaultErrorShape> | null;
  isLoading: boolean;
};

const Comments: React.FC<CommentsProps> = ({
  comments,
  input,
  error,
  isLoading,
}) => {
  return (
    <>
      {isLoading ? <CommentSkeleton /> : null}
      {comments.length < 1 && !error && !isLoading ? (
        <div className="p-4 text-center">So empty... 😶</div>
      ) : error ? (
        <div className="p-4 text-center font-bold text-red-600">
          {error?.message}
        </div>
      ) : null}

      {comments.map((comment) => (
        <CommentItem comment={comment} key={comment.id} input={input} />
      ))}
    </>
  );
};

export default memo(Comments);
