import { db } from "@/db/drizzle";
import { daysTable } from "@/db/schema/Task";
import { eq } from "drizzle-orm";

export const dayService = {
   async getorCreate(date: Date) {
      const parsed = date.toISOString().split("T")[0];

      let existingDay = await db.query.day.findFirst({
         where: eq(daysTable.date, parsed),
      });

      if (!existingDay) {
         const [newday] = await db
            .insert(daysTable)
            .values({ date: parsed })
            .returning();
         existingDay = newday;
      }
      return existingDay;
   },
};
