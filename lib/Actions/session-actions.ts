"use server";
import z, { promise, success } from "zod";
import {
   CreateSessionInput,
   createSessionSchema,
   UpdateSessionInput,
   updateSessionSchema,
} from "../validations/session-validation";
import { sessionService } from "../services/session-services";
import { isPageStatic } from "next/dist/build/utils";
import { revalidatePath } from "next/cache";
import { error } from "console";

type ActionResult<T> =
   | { sucess: true; data: T }
   | { sucess: false; error: string }
   | { sucess: false; errors: Record<string, string[]> };

export async function createSession(
   dayId: number,
   data: CreateSessionInput
): Promise<ActionResult<{ id: number }>> {
   try {
      console.log(data);
      const vaildated = createSessionSchema.parse(data);
      console.log("parsed");
      const hasTimeConflit = await sessionService.checkTimeConflits(
         dayId,
         vaildated.startTime,
         vaildated.endTime
      );

      if (hasTimeConflit) {
         return {
            sucess: false,
            errors: {
               startTime: ["Timeblock already Taken"],
            },
         };
      }
      const session = await sessionService.create(dayId, vaildated);

      if (vaildated.tagIds.length > 0) {
         await sessionService.linkTags(session.id, vaildated.tagIds);
      }

      revalidatePath("/(dashboard)", "layout");
      return { sucess: true, data: { id: session.id } };
   } catch (error) {
      console.error("Create Session ERR ", error);

      if (error instanceof z.ZodError) {
         console.log("create session Error ", error.issues);
         return {
            sucess: false,
            errors: z.treeifyError(error),
         };
      }
      console.error("Create session Error ", error);
      return {
         sucess: false,
         error: "Failed to create session",
      };
   }
}

export async function updateSession(
   sessionId: number,
   data: UpdateSessionInput
) {
   try {
      const validated = updateSessionSchema.parse(data);

      const existing = await sessionService.getById(sessionId);

      if (!existing) {
         return {
            success: false,
            error: "Session Not Found",
         };
      }

      if (validated.startTime || validated.endTime) {
         const startTime = validated.startTime || existing.startTime;
         const endTime = validated.endTime || existing.endTime;

         const conflit = await sessionService.checkTimeConflits(
            existing.dayId,
            startTime,
            endTime,
            sessionId
         );
         if (conflit) {
            return {
               success: false,
               errors: {
                  startTime: [
                     "This TimeSlot conflit with another Sessions Timeslot",
                  ],
               },
            };
         }
      }
      await sessionService.update(sessionId, validated);

      if (validated.tagIds) {
         await sessionService.updateTags(sessionId, validated.tagIds);
      }
      revalidatePath("/(dashboard)", "layout");

      return { success: true, data: { id: sessionId } };
   } catch (err) {
      console.log("session update error", err);

      if (err instanceof z.ZodError) {
         console.log("update session Error,  zod ", err.issues);
         return {
            sucess: false,
            errors: z.treeifyError(err),
         };
      }

      return {
         success: false,
         error: "Failed to update session",
      };
   }
}

export async function DeleteSession(id: number) {
   await sessionService.deleteById(id);
   revalidatePath("/(dashboard)", "layout");
}
