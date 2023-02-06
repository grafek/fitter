import type { TRPCClientErrorBase } from "@trpc/client";
import type { DefaultErrorShape } from "@trpc/server";
import { memo } from "react";
import { type RouterInputs, type RouterOutputs } from "../../utils/trpc";
import Comment from "./Comment";

type CommentListProps = {
  comments: RouterOutputs["comment"]["infiniteComments"]["comments"];
  input: RouterInputs["comment"]["infiniteComments"];
  error: TRPCClientErrorBase<DefaultErrorShape> | null;
};

const CommentList: React.FC<CommentListProps> = ({
  comments,
  input,
  error,
}) => {
  return (
    <>
      {comments.length < 1 && !error ? (
        <div className="p-4 text-center">So empty... 😶</div>
      ) : error ? (
        <div className="p-4 text-center font-bold text-red-600">
          {error?.message}
        </div>
      ) : null}

      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} input={input} />
      ))}
    </>
  );
};

export default memo(CommentList);
