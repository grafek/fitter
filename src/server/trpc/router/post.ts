import { z } from "zod";
import { postSchemaInput } from "../../../schemas/post.schema";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getUsersPosts: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      return await ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          creatorId: userId,
        },
      });
    }),
  create: protectedProcedure
    .input(postSchemaInput)
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      const { user } = session;
      const { description, sport, title, workoutDate } = input;

      const workoutDateTime = new Date(workoutDate);

      const addedPost = await ctx.prisma.post.create({
        data: {
          title,
          description,
          sport,
          workoutDate: workoutDateTime,
          creatorId: user.id,
          creatorName: user.name,
          creatorImage: user.image,
        },
      });

      return addedPost;
    }),
  delete: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const deletedPost = await ctx.prisma.post.delete({
        where: {
          id: postId,
        },
      });
      return deletedPost;
    }),
  update: protectedProcedure
    .input(postSchemaInput)
    .mutation(async ({ ctx, input }) => {
      const { title, description, sport, workoutDate, id: postId } = input;
      const workoutDateTime = new Date(workoutDate);

      const updatePost = await ctx.prisma.post.update({
        where: { id: postId },
        data: {
          title,
          description,
          sport,
          workoutDate: workoutDateTime,
        },
      });

      return updatePost;
    }),
});
