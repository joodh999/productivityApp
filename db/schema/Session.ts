import {
   boolean,
   date,
   integer,
   pgTable,
   serial,
   text,
   timestamp,
} from "drizzle-orm/pg-core";
import { daysTable, tasksTable } from "./Task";

export const sessionsTable = pgTable("sessions", {
   id: serial("id").primaryKey(),
   title: text("title"),
   note: text("note"),
   startTime: timestamp("start_time").notNull(),
   endTime: timestamp("end_time").notNull(),
   // ref
   dayId: integer("day_id")
      .notNull()
      .references(() => daysTable.id, { onDelete: "set null" }),
   taskId: integer("task_id").references(() => tasksTable.id, {
      onDelete: "set null",
   }),
});
