import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  getUserById: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });
      return user;
    }),
});
