import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const commentRouter = router({
  infiniteComments: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).nullish(),
        cursor: z.string().nullish(),
        where: z.object({
          parentId: z.string().optional().nullable(),
          post: z.object({
            id: z.string(),
          }),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 3;
      const { cursor, where } = input;

      const userId = ctx.session.user.id;

      const comments = await ctx.prisma.comment.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { updatedAt: "desc" },
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          post: {
            select: {
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
              children: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (comments.length > limit) {
        const nextItem = comments.pop() as typeof comments[number];
        nextCursor = nextItem.id;
      }
      return {
        comments,
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        postId: z.string(),
        parentId: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { text, postId, parentId } = input;

      let addedComment;

      if (parentId) {
        addedComment = await ctx.prisma.comment.create({
          data: {
            text,
            parent: {
              connect: {
                id: parentId,
              },
            },
            user: {
              connect: {
                id: userId,
              },
            },
            post: {
              connect: {
                id: postId,
              },
            },
          },
        });
      } else {
        addedComment = await ctx.prisma.comment.create({
          data: {
            text,
            user: {
              connect: {
                id: userId,
              },
            },
            post: {
              connect: {
                id: postId,
              },
            },
          },
        });
      }

      return addedComment;
    }),
  like: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { commentId } = input;

      return await ctx.prisma.like.create({
        data: {
          comment: {
            connect: {
              id: commentId,
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
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { commentId } = input;

      return await ctx.prisma.like.delete({
        where: {
          userId_commentId: {
            commentId,
            userId,
          },
        },
      });
    }),
});
