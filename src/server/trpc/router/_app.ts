import { router } from "../trpc";
import { authRouter } from "./auth";
import { commentRouter } from "./comment";
import { followRouter } from "./follow";
import { postRouter } from "./post";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  post: postRouter,
  user: userRouter,
  comment: commentRouter,
  follow: followRouter,
});

export type AppRouter = typeof appRouter;
