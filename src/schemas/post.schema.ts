import { z } from "zod";

export type AddPostFormSchema = {
  title: string;
  description: string;
  sport: string;
  workoutDate: Date;
};

export const postSchemaInput = z.object({
  title: z
    .string()
    .trim()
    .max(20, { message: "Title cannot be longer than 20 characters" })
    .min(1, { message: "Title cannot be empty!" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description cannot be empty!" })
    .max(200, { message: "Title cannot be longer than 200 characters" }),
  sport: z.string(),
  workoutDate: z
    .string()
    .trim()
    .min(1, { message: "Workout Date cannot be empty!" }),
});
