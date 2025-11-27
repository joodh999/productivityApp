import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { tasksTable } from "@/db/schema/Task";

export const createTaskSchema = createInsertSchema(tasksTable);
export const createTaskWTags = createTaskSchema.extend({
   tagIds: z.array(z.number()),
});
export type createTask = z.infer<typeof createTaskSchema>;
export type createTaskWTags = z.infer<typeof createTaskWTags>;
