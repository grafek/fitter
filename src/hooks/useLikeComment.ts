import { type RouterInputs, trpc } from "../utils/trpc";

const useLikeComment = ({
  input,
  userId,
}: {
  input: RouterInputs["comment"]["infiniteComments"];
  userId: string;
}) => {
  const ctx = trpc.useContext();
  return trpc.comment.like.useMutation({
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
                  likes: [
                    {
                      userId,
                    },
                  ],
                  _count: {
                    children: comment._count.children,
                    likes: comment._count.likes + 1,
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

export default useLikeComment;
