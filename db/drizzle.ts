import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';

import { daysTable, subTasksTable, tasksTable } from "./schema/Task";
import { sessionsTable } from "./schema/Session";
import { tagsTable, tasksTagsTable,sessionsTagsTable } from "./schema/Tags";
import { daysRelations, sessionsRelations, sessionsTagsRelations, subTasksRelations,
     tagsRelations, tasksRelations, 
     tasksTagsRelations} from "./schema/Relations";


export const db = drizzle(process.env.DATABASE_URL!, {
    schema: {
        task: tasksTable,
        subtask: subTasksTable, 
        day: daysTable,
        session: sessionsTable,
        tag: tagsTable,
        sessionTag: sessionsTagsTable,
        taskTag: tasksTagsTable,
        
        daysRelations,
        sessionsRelations,
        sessionsTagsRelations,
        subTasksRelations,
        tagsRelations,
        tasksTagsRelations,
        tasksRelations,
    }   
});