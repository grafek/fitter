import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { postSchemaInput } from "../../../schemas/post.schema";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),
  getById: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { postId } = input;
      const foundPost = await ctx.prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      return foundPost;
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
          updatedAt: undefined,
        },
      });

      return addedPost;
    }),
  delete: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;

      const user = await prisma?.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { posts: true },
      });

      if (!user?.posts.find((post) => post.id === postId)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You cannot remove not your own posts!",
        });
      }

      const deletedPost = await ctx.prisma.post.delete({
        where: {
          id: postId,
        },
      });
      return deletedPost;
    }),
  update: protectedProcedure
    .input(z.object({ postId: z.string(), postSchemaInput }))
    .mutation(async ({ ctx, input }) => {
      const user = await prisma?.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { posts: true },
      });

      const { postId } = input;

      if (!user?.posts.find((post) => post.id === postId)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You cannot edit not your own posts!",
        });
      }

      const { title, description, sport, workoutDate } = input.postSchemaInput;
      const workoutDateTime = new Date(workoutDate);

      const updatePost = await ctx.prisma.post.update({
        where: { id: postId },
        data: {
          title,
          description,
          sport,
          workoutDate: workoutDateTime,
          updatedAt: new Date(),
        },
      });

      return updatePost;
    }),
});
