"use server";
import { revalidatePath } from "next/cache";
import { tagService } from "../services/tag-service";
import { z } from "zod";
import { isDatabaseError } from "../utils";

const createTagSchema = z.object({
   name: z.string().min(1, "Name required").max(20, "Name too long"),
   color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
});

type ActionResult<T> =
   | { success: true; data: T }
   | { success: false; error: string }
   | { success: false; errors: Record<string, string[]> };

export async function DeleteTag(id: number) {
   await tagService.deleteById(id);
   revalidatePath("/");
}

export async function CreateTag(
   data: unknown
): Promise<ActionResult<{ id: number; name: string; color: string }>> {
   try {
      const validation = createTagSchema.safeParse(data);

      if (!validation.success) {
         return {
            success: false,
            error: validation.error.message,
         };
      }

      const tag = await tagService.createTag(validation.data);

      revalidatePath("/", "layout");
      return {
         success: true,
         data: tag,
      };
   } catch (error) {
      console.error("Failed to Create Tag : ", error);

      if (isDatabaseError(error)) {
         if (error.code === "23505" || error.message?.includes("unique")) {
            return {
               success: false,
               errors: {
                  name: ["Tag Name is already taken!"],
               },
            };
         }
      }
      return {
         success: false,
         error: "Failed to Create Tag",
      };
   }
}
