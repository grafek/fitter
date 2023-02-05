import { z } from "zod";

export interface AddCommentFormSchema {
  commentContent: string;
}

export const commentSchemaInput = z.object({
  commentContent: z
    .string()
    .trim()
    .min(1, { message: "Comment cannot be empty!" })
    .max(300, { message: "Comment cannot be longer than 300 characters" }),
});

export const COMMENTS_LIMIT = 3;
