import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { postSchemaInput } from "../../../schemas/post.schema";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
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
  infinitePosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 5;
      const { cursor } = input;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          updatedAt: "desc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop() as typeof posts[number];
        nextCursor = nextItem.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
  infiniteUsersPosts: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(20).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 3;
      const { userId, cursor } = input;

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          creatorId: userId,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > limit) {
        const nextItem = posts.pop() as typeof posts[number];
        nextCursor = nextItem.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(postSchemaInput)
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      const { user } = session;
      const { description, sport, title, workoutDate, image } = input;

      const workoutDateTime = new Date(workoutDate);

      const addedPost = await ctx.prisma.post.create({
        data: {
          title,
          description,
          sport,
          workoutDate: workoutDateTime,
          image,
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
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { posts: true },
      });
      const { title, description, sport, workoutDate, image } =
        input.postSchemaInput;

      const { postId } = input;

      if (!user?.posts.find((post) => post.id !== postId)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You cannot edit not your own posts!",
        });
      }

      const workoutDateTime = new Date(workoutDate);

      const updatePost = await ctx.prisma.post.update({
        where: { id: postId },
        data: {
          title,
          description,
          sport,
          image,
          workoutDate: workoutDateTime,
          updatedAt: new Date(),
        },
      });

      return updatePost;
    }),
});
