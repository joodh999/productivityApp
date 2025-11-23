import { sessionsTable } from "@/db/schema/Session";
import { tagsTable } from "@/db/schema/Tags";
import { tasksTable } from "@/db/schema/Task";
import { InferSelectModel } from "drizzle-orm";

export type Session = InferSelectModel<typeof sessionsTable>;
export type Tag = InferSelectModel<typeof tagsTable>;
export type Task = InferSelectModel<typeof tasksTable>;

export type sessionListItem = Omit<Session, "dayId" | "taskId"> & {
   task: Pick<Task, "id" | "title"> | null;
   tags: Omit<Tag, "createdAt">[];
};
