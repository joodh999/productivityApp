import {
   boolean,
   date,
   integer,
   pgTable,
   serial,
   text,
   timestamp,
   primaryKey,
} from "drizzle-orm/pg-core";
import { sessionsTable } from "./Session";
import { tasksTable } from "./Task";

export const tagsTable = pgTable("tags", {
   id: serial("id").primaryKey(),
   primary: boolean("primary").default(false).notNull(),
   name: text("name").notNull().unique(),
   color: text("color").notNull(),
   createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessionsTagsTable = pgTable(
   "sessions_tags",
   {
      sessionId: integer("session_id")
         .notNull()
         .references(() => sessionsTable.id, { onDelete: "cascade" }),
      tagId: integer("tag_id")
         .notNull()
         .references(() => tagsTable.id, { onDelete: "cascade" }),
   },
   (table) => [primaryKey({ columns: [table.sessionId, table.tagId] })]
);

export const tasksTagsTable = pgTable(
   "tasks_tags",
   {
      taskId: integer("task_id")
         .notNull()
         .references(() => tasksTable.id, { onDelete: "cascade" }),
      tagId: integer("tag_id")
         .notNull()
         .references(() => tagsTable.id, { onDelete: "cascade" }),
   },
   (table) => [primaryKey({ columns: [table.tagId, table.taskId] })]
);
