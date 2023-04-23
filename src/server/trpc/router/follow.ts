import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const followRouter = router({
  follow: protectedProcedure
    .input(z.object({ followerId: z.string(), followingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { followerId, followingId } = input;
      const follow = await ctx.prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
      return follow;
    }),
  unfollow: protectedProcedure
    .input(z.object({ followerId: z.string(), followingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { followerId, followingId } = input;
      const unfollow = await ctx.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
      return unfollow;
    }),
  getFollowing: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      const follows = await ctx.prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      const followingIds = follows.map((follow) => follow.followingId);
      return followingIds;
    }),
});
