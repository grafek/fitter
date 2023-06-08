import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  getUserById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });
      return user;
    }),
  getAll: publicProcedure
    .input(
      z.object({
        where: z
          .object({
            likes: z
              .object({
                some: z
                  .object({
                    postId: z.string().optional(),
                    commentId: z.string().optional(),
                  })
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { where } = input;
      return await ctx.prisma.user.findMany({
        where,
        orderBy: { name: "desc" },
      });
    }),
  infiniteUsers: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).nullish(),
        cursor: z.string().nullish(),
        where: z
          .object({
            name: z
              .object({
                contains: z.string().optional(),
              })
              .optional(),
            followers: z
              .object({
                some: z
                  .object({ followerId: z.string().optional() })
                  .optional(),
              })
              .optional(),
            following: z
              .object({
                some: z
                  .object({ followingId: z.string().optional() })
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 4;
      const { cursor, where } = input;

      const users = await ctx.prisma.user.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy: {
          name: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (users.length > limit) {
        const nextItem = users.pop() as typeof users[number];
        nextCursor = nextItem.id;
      }
      return {
        users,
        nextCursor,
      };
    }),
});
