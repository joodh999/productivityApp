"use server";
import { revalidatePath } from "next/cache";
import { taskService } from "../services/task-service";
import { createSessionSchema } from "../validations/session-validation";
import {
   insertTaskWTags,
   createTaskWTags,
} from "../validations/task-validation";
import z from "zod";
import { dayService } from "../services/day-service";

type ActionResult<T> =
   | { sucess: true; data: T }
   | { sucess: false; error: string }
   | { sucess: false; errors: Record<string, string[]> };

export async function createTaskAction(
   data: insertTaskWTags,
   DateString?: string
): Promise<ActionResult<{ id: number }>> {
   try {
      console.log("create task action");
      const { tagIds, ...task } = createTaskWTags.parse(data);

      let day;
      if (!task.dayId && DateString) {
         day = await dayService.getorCreate(new Date(DateString));
      }

      const newtask = await taskService.create(task, day?.id);
      console.log(newtask);

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
