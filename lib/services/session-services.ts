import { db } from "@/db/drizzle";
import { sessionsTable } from "@/db/schema/Session";
import { and, eq, gt, gte, lt, lte, ne, or } from "drizzle-orm";
import {
   CreateSessionInput,
   UpdateSessionInput,
} from "../validations/session-validation";
import { sessionsTagsTable } from "@/db/schema/Tags";

export const sessionService = {
   async getListbyDay(dayId: number) {
      const sessions = await db.query.session.findMany({
         where: eq(sessionsTable.dayId, dayId),
         columns: {
            taskId: false,
         },
         with: {
            task: {
               columns: {
                  id: true,
                  title: true,
               },
            },
            sessionTags: {
               columns: { sessionId: false, tagId: false },
               with: {
                  tag: {
                     columns: { createdAt: false },
                  },
               },
            },
         },
      });

      const falettenSessions = sessions.map(({ sessionTags, ...session }) => ({
         ...session,
         tags: sessionTags.map((sessionTag) => sessionTag.tag),
      }));

      return falettenSessions;
   },

   async getById(sessionId: number) {
      return db.query.session.findFirst({
         where: eq(sessionsTable.id, sessionId),
      });
   },

   async create(dayId: number, data: CreateSessionInput) {
      const [session] = await db
         .insert(sessionsTable)
         .values({
            dayId: dayId,
            title: data.title,
            startTime: data.startTime,
            endTime: data.endTime,
            note: data.note,
            taskId: data.taskId,
         })
         .returning();
      // if (data.tagIds.length > 0) {
      //    await db.insert(sessionsTagsTable).values(
      //       data.tagIds.map((tagId) => ({
      //          tagId,
      //          sessionId: session.id,
      //       }))
      //    );
      // }
      return session;
   },

   async update(sessionId: number, data: UpdateSessionInput) {
      const updateData: Record<string, any> = {};

      if (data.title !== undefined) updateData.title = data.title;
      if (data.startTime !== undefined) updateData.startTime = data.startTime;
      if (data.endTime !== undefined) updateData.endTime = data.endTime;
      if (data.note !== undefined) updateData.note = data.note;
      if (data.taskId !== undefined) updateData.taskId = data.taskId;

      if (Object.keys(updateData).length === 0) {
         return true;
      }
      console.log(updateData);

      await db
         .update(sessionsTable)
         .set(updateData)
         .where(eq(sessionsTable.id, sessionId));

      return true;
   },

   async linkTags(sessionId: number, tagIds: number[]) {
      if (tagIds.length === 0) return;

      await db.insert(sessionsTagsTable).values(
         tagIds.map((tagId) => ({
            tagId,
            sessionId: sessionId,
         }))
      );
   },

   async updateTags(sessionId: number, tagIds: number[]) {
      //TODO: better way?
      await db
         .delete(sessionsTagsTable)
         .where(eq(sessionsTagsTable.sessionId, sessionId));

      if (tagIds.length > 0) {
         await this.linkTags(sessionId, tagIds);
      }
   },

   async checkTimeConflits(
      dayId: number,
      startTime: Date,
      endTime: Date,
      excludeSessionId?: number
   ) {
      const conditions = [eq(sessionsTable.dayId, dayId)];

      if (excludeSessionId) {
         conditions.push(ne(sessionsTable.id, excludeSessionId));
      }

      const conflicting = await db
         .select()
         .from(sessionsTable)
         .where(
            and(
               ...conditions,
               and(
                  lt(sessionsTable.endTime, startTime),
                  gt(sessionsTable.startTime, endTime)
               )
            )
         )
         .limit(1);

      return conflicting.length > 0;
   },

   async deleteById(id: number) {
      console.log(id);
      await db.delete(sessionsTable).where(eq(sessionsTable.id, id));
   },
};
