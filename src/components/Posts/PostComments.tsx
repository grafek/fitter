import { useInfiniteComments } from "../../hooks";
import { COMMENTS_LIMIT } from "../../schemas/comment.schema";
import type { RouterInputs } from "../../utils/trpc";
import CommentForm from "../Comments/CommentForm";
import CommentList from "../Comments/CommentList";
import { Button, Loading } from "../Layout";

type PostCommentsProps = { postId: string; commentsShown: boolean };

const PostComments: React.FC<PostCommentsProps> = ({
  postId,
  commentsShown,
}) => {
  const commentsInputData: RouterInputs["comment"]["infiniteComments"] = {
    limit: COMMENTS_LIMIT,
    where: {
      parentId: null,
      post: {
        id: postId,
      },
    },
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    error,
  } = useInfiniteComments({
    input: commentsInputData,
  });

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <div className="flex flex-col divide-y-[1px] rounded-md bg-[#f6f8fa] shadow-lg outline outline-1 outline-[#d0d7de]  dark:divide-gray-700 dark:bg-[#21262d] dark:outline-[#30363d]">
      <CommentForm postId={postId} />

      {commentsShown && !isLoading ? (
        <CommentList
          comments={comments}
          input={commentsInputData}
          error={error}
        />
      ) : isLoading ? (
        <Loading />
      ) : null}
      {comments.length >= COMMENTS_LIMIT && hasNextPage && commentsShown ? (
        <Button
          onClick={() => {
            fetchNextPage();
          }}
          isRounded
          className="m-2 py-2 text-blue-700 outline-blue-600 hover:bg-gray-200 dark:text-blue-500 dark:hover:bg-gray-800"
        >
          {isFetchingNextPage ? <Loading /> : "Show more comments"}
        </Button>
      ) : null}
    </div>
  );
};

export default PostComments;
