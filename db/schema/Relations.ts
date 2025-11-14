import { relations } from "drizzle-orm";
import { sessionsTagsTable, tagsTable, tasksTagsTable } from "./Tags";
import { sessionsTable } from "./Session";
import { daysTable, tasksTable, subTasksTable } from "./Task";


export const tagsRelations = relations(tagsTable, ({many}) => ({
  tasks: many(tasksTagsTable),
  sessions: many(sessionsTagsTable)
}))

export const daysRelations = relations(daysTable, ({many}) => ({
  sessions: many(sessionsTable),
  tasks: many(tasksTable)
}))

export const tasksRelations = relations(tasksTable, ({ one, many }) => ({
  day: one(daysTable, {
    fields: [tasksTable.dayId],
    references: [daysTable.id],
  }),
  subTasks: many(subTasksTable),
  sessions: many(sessionsTable),
  Tags: many(tasksTagsTable)
}));

export const subTasksRelations = relations(subTasksTable, ({ one }) => ({
  task: one(tasksTable, {
    fields: [subTasksTable.taskId],
    references: [tasksTable.id],
  }),
}));

export const sessionsRelations = relations(sessionsTable, ({ one, many }) => ({
  day: one(daysTable, {
    fields: [sessionsTable.dayId],
    references: [daysTable.id],
  }),
  task: one(tasksTable, {
    fields: [sessionsTable.taskId],
    references: [tasksTable.id],
  }),
  sessionTags: many(sessionsTagsTable),
}));

export const tasksTagsRelations = relations(tasksTagsTable, ({ one }) => ({
  task: one(tasksTable, {
    fields: [tasksTagsTable.taskId],
    references: [tasksTable.id],
  }),
  tag: one(tagsTable, {
    fields: [tasksTagsTable.tagId],
    references: [tagsTable.id],
  }),
}));

export const sessionsTagsRelations = relations(sessionsTagsTable, ({ one }) => ({
  session: one(sessionsTable, {
    fields: [sessionsTagsTable.sessionId],
    references: [sessionsTable.id],
  }),
  tag: one(tagsTable, {
    fields: [sessionsTagsTable.tagId],
    references: [tagsTable.id],
  }),
}));