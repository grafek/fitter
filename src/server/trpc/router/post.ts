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
  add: protectedProcedure
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
});
