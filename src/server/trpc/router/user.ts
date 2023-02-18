import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

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
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  infiniteUsers: protectedProcedure
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
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 1;
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
