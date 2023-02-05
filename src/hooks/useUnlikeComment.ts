import { type RouterInputs, trpc } from "../utils/trpc";

const useUnlikeComment = ({
  input,
}: {
  input: RouterInputs["comment"]["infiniteComments"];
}) => {
  const ctx = trpc.useContext();
  return trpc.comment.unlike.useMutation({
    async onMutate({ commentId }) {
      await ctx.comment.infiniteComments.cancel();

      ctx.comment.infiniteComments.setInfiniteData({ ...input }, (data) => {
        if (!data) {
          return {
            pages: [],
            pageParams: [],
          };
        }
        const updatedComments = data.pages.map((page) => {
          return {
            comments: page.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: [],
                  _count: {
                    children: comment._count.children,
                    likes: comment._count.likes - 1,
                  },
                };
              }
              return comment;
            }),
            nextCursor: page.nextCursor,
          };
        });
        return {
          ...data,
          pages: updatedComments,
        };
      });
    },
  });
};

export default useUnlikeComment;
