import { memo } from "react";
import { type RouterInputs, type RouterOutputs } from "../../utils/trpc";
import Comment from "./Comment";

type CommentListProps = {
  comments: RouterOutputs["comment"]["infiniteComments"]["comments"];
  input: RouterInputs["comment"]["infiniteComments"];
};

const CommentList: React.FC<CommentListProps> = ({ comments, input }) => {
  return (
    <>
      {comments.length < 1 || !comments ? (
        <div className="p-3 text-center">So empty... 😶 </div>
      ) : null}
      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} input={input} />
      ))}
    </>
  );
};

export default memo(CommentList);
