import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  content: z
    .string()
    .trim()
    .min(1, { message: "Content is required" })
    .max(10000, { message: "Content must be less than 10000 characters" }),
  tags: z.array(z
    .string()
    .trim()
    .toLowerCase())
    .max(10)
    .optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = createNoteSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field (title or content) must be provided' }
  );

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;  