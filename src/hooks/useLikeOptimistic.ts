import { POSTS_LIMIT } from "../utils/globals";
import { trpc } from "../utils/trpc";

const useLikeOptimistic = (userId: string) => {
  const ctx = trpc.useContext();
  return trpc.post.like.useMutation({
    async onMutate({ postId }) {
      await ctx.post.infinitePosts.cancel();

      ctx.post.infinitePosts.setInfiniteData({ limit: POSTS_LIMIT }, (data) => {
        if (!data) {
          return {
            pages: [],
            pageParams: [],
          };
        }
        const updatedPosts = data.pages.map((page) => {
          return {
            posts: page.posts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  likes: [{ userId }],
                  _count: {
                    likes: post._count.likes + 1,
                  },
                };
              }
              return post;
            }),
            nextCursor: page.nextCursor,
          };
        });
        return {
          ...data,
          pages: updatedPosts,
        };
      });
    },
  });
};

export default useLikeOptimistic;
