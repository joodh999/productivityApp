import z, { promise } from "zod";
import {
   CreateSessionInput,
   createSessionSchema,
   updateSessionSchema,
} from "../validations/session-validation";
import { sessionService } from "../services/session-services";
import { isPageStatic } from "next/dist/build/utils";
import { revalidatePath } from "next/cache";

type ActionResult<T> =
   | { sucess: true; data: T }
   | { sucess: false; error: string }
   | { sucess: false; errors: Record<string, string[]> };

export async function createSession(
   dayId: number,
   data: CreateSessionInput
): Promise<ActionResult<{ id: number }>> {
   try {
      const vaildated = createSessionSchema.parse(data);

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

// export async function updateSession(sessionId:number, data: CreateSessionInput) {

//     try {
//         const validated = updateSessionSchema.parse(data)

//         if(data.startTime && data.endTime) {
//         const hasTimeConflit =
//         }

//     }catch (err) {

//     }
// }
