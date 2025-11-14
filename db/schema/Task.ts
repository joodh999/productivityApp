import {
   boolean,
   date,
   integer,
   pgTable,
   serial,
   text,
   timestamp,
} from "drizzle-orm/pg-core";

export const daysTable = pgTable("day", {
   id: serial("id").primaryKey(),
   date: date("date").notNull().unique(),
});

export const tasksTable = pgTable("tasks", {
   id: serial("id").primaryKey(),
   title: text("title").notNull(),
   description: text("description"),
   dueDate: date("due_date"),
   completed: boolean("completed").default(false).notNull(),
   createdAt: timestamp("created_at").notNull().defaultNow(),
   // ref
   dayId: integer("day_id").references(() => daysTable.id, {
      onDelete: "set null",
   }),
});

export const subTasksTable = pgTable("sub_tasks", {
   id: serial("id").primaryKey(),
   title: text("title").notNull(),
   completed: boolean("completed").default(false).notNull(),
   order: integer("order").default(0).notNull(),
   createdAt: timestamp("created_at").notNull().defaultNow(),
   // ref
   taskId: integer("task_id").references(() => tasksTable.id, {
      onDelete: "cascade",
   }),
});
