import { z } from "zod";

export const createSessionSchema = z
   .object({
      title: z.string().min(1).max(100),
      startTime: z.date(),
      endTime: z.date(),
      note: z.string().max(2000).optional(),
      taskId: z.number().optional(),
      tagIds: z.array(z.number()).default([]),
   })
   .refine(
      (data) => {
         return data.endTime > data.startTime;
      },
      { message: "End Time Must be after Start Time", path: ["endTime"] }
   );

export const updateSessionSchema = z
   .object({
      title: z.string().min(1).max(100).optional(),
      startTime: z.date().optional(),
      endTime: z.date().optional(),
      note: z.string().max(2000).optional().nullable(),
      taskId: z.number().optional().nullable(),
      tagIds: z.array(z.number()).optional(),
   })
   .refine(
      (data) => {
         if (data.startTime && data.endTime) {
            data.endTime > data.startTime;
         }
         return true;
      },
      { message: "End Time Must be after Start Time", path: ["endTime"] }
   );

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
