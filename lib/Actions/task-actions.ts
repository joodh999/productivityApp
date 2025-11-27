import { revalidatePath } from "next/cache";
import { taskService } from "../services/task-service";
import { createSessionSchema } from "../validations/session-validation";
import {
   createTask,
   createTaskSchema,
   createTaskWTags,
} from "../validations/task-validation";
import z from "zod";

type ActionResult<T> =
   | { sucess: true; data: T }
   | { sucess: false; error: string }
   | { sucess: false; errors: Record<string, string[]> };

export async function createSession(
   dayId: number,
   data: createTaskWTags
): Promise<ActionResult<{ id: number }>> {
   try {
      const { tagIds, ...task } = createTaskWTags.parse(data);

      const newtask = await taskService.create(dayId, task);

      if (tagIds?.length > 0) {
         await taskService.linkTags(newtask.id, tagIds);
      }
      revalidatePath("/(dashboard)", "layout");
      return { sucess: true, data: { id: newtask.id } };
   } catch (error) {
      console.log("create task Error ", error);
      if (error instanceof z.ZodError) {
         return {
            sucess: false,
            errors: z.treeifyError(error),
         };
      }
      return {
         sucess: false,
         error: "Failed to create Task",
      };
   }
}
