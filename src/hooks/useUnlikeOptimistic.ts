import { type RouterInputs, trpc } from "../utils/trpc";

const useUnlikeOptimistic = ({
  input,
}: {
  input: RouterInputs["post"]["infinitePosts"];
}) => {
  const ctx = trpc.useContext();
  return trpc.post.unlike.useMutation({
    async onMutate({ postId }) {
      await ctx.post.infinitePosts.cancel();

      ctx.post.infinitePosts.setInfiniteData({ ...input }, (data) => {
        console.log(data);
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
                  likes: [],
                  _count: {
                    likes: post._count.likes - 1,
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

export default useUnlikeOptimistic;
