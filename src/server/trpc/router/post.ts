import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { postSchemaInput } from "../../../schemas/post.schema";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
  getById: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { postId } = input;
      const userId = ctx.session?.user?.id;
      const foundPost = await ctx.prisma.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          creator: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
          likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });
      return foundPost;
    }),
  infinitePosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).nullish(),
        cursor: z.string().nullish(),
        where: z
          .object({
            creator: z
              .object({
                id: z.string().optional(),
              })
              .optional(),
            id: z.string().optional(),
          })
          .optional()
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 1;
      const { cursor, where } = input;
      const userId = ctx.session?.user?.id;

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          updatedAt: "desc",
        },
        where,
        include: {
          creator: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
          likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
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
      const userId = ctx.session.user.id;
      const { description, sport, title, workoutDate, image } = input;

      const workoutDateTime = new Date(workoutDate);

      const addedPost = await ctx.prisma.post.create({
        data: {
          title,
          description,
          sport,
          workoutDate: workoutDateTime,
          image,
          updatedAt: undefined,
          creator: {
            connect: {
              id: userId,
            },
          },
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
        select: { posts: true, likes: true },
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

      if (!user?.posts.find((post) => post.id === postId)) {
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
  like: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { postId } = input;

      return await ctx.prisma.like.create({
        data: {
          post: {
            connect: {
              id: postId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  unlike: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { postId } = input;

      return await ctx.prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    }),
});
