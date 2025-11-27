import TaskList from "@/components/Tasks/TaskList";
import { db } from "@/db/drizzle";
import { tasksTable } from "@/db/schema/Task";
import { desc, eq, or } from "drizzle-orm";
import { createTask } from "../validations/task-validation";
import { tasksTagsTable } from "@/db/schema/Tags";

export const taskService = {
   async getTasksforSessionForm() {
      const tasks = await db.query.task.findMany({
         columns: {
            title: true,
            id: true,
         },
         orderBy: desc(tasksTable.createdAt),
         where: eq(tasksTable.completed, false),
      });
      return tasks;
   },
   async getTaskForDay(day: { id: number; date: string }, limit = 5) {
      const tasks = await db.query.task.findMany({
         where: or(
            eq(tasksTable.dayId, day.id),
            eq(tasksTable.dueDate, day.date)
         ),
         orderBy: desc(tasksTable.createdAt),
         with: {
            subTasks: true,
         },
      });
      return tasks;
   },

   async create(dayId: number, task: createTask) {
      const [newTask] = await db
         .insert(tasksTable)
         .values({
            title: task.title,
            dayId: dayId,
            description: task.description,
            dueDate: task.dueDate,
         })
         .returning();
      return newTask;
   },

   async linkTags(taskId: number, tagIds: number[]) {
      if (tagIds.length === 0) return;

      await db.insert(tasksTagsTable).values(
         tagIds.map((tagId) => ({
            tagId,
            taskId: taskId,
         }))
      );
   },

   async updateTag(taskId: number, tagIds: number[]) {
      await db.delete(tasksTagsTable).where(eq(tasksTagsTable.taskId, taskId));

      if (tagIds.length > 0) {
         await this.linkTags(taskId, tagIds);
      }
   },
};
