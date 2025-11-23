import { db } from "@/db/drizzle";
import { tagsTable } from "@/db/schema/Tags";
import { Tag } from "@/types";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const tagService = {
   async getAllTagsForSessionForm() {
      const tags = await db.query.tag.findMany({
         columns: {
            createdAt: false,
         },
         orderBy: asc(tagsTable.createdAt),
      });
      return tags;
   },
   async deleteById(id: number) {
      await db.delete(tagsTable).where(eq(tagsTable.id, id));
   },

   async createTag(tag: Pick<Tag, "name" | "color">) {
      const [newtag] = await db
         .insert(tagsTable)
         .values({ name: tag.name, color: tag.color })
         .returning();
      return newtag;
   },
};
