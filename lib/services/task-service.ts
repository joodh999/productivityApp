import { db } from "@/db/drizzle";
import { tasksTable } from "@/db/schema/Task";
import { asc, eq } from "drizzle-orm";

export const taskService = {
   async getTasksforSessionForm() {
      const tasks = await db.query.task.findMany({
         columns: {
            title: true,
            id: true,
         },
         orderBy: asc(tasksTable.createdAt),
         where: eq(tasksTable.completed, false),
      });
      return tasks;
   },
};
