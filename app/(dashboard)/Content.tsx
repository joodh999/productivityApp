import Sidebar from "@/components/Sessions/Sidebar";
import { dayService } from "@/lib/services/day-service";
import { sessionService } from "@/lib/services/session-services";
import { tagService } from "@/lib/services/tag-service";
import { taskService } from "@/lib/services/task-service";
import { console } from "inspector";
import { da } from "zod/v4/locales";

export default async function Content({ date }: { date: string | undefined }) {
   const targetDate = date ? new Date(date) : new Date();

   const day = await dayService.getorCreate(new Date("2025-10-11"));
   const sessions = await sessionService.getListbyDay(day.id);
   const tags = await tagService.getAllTagsForSessionForm();
   const tasks = await taskService.getTasksforSessionForm();

   return (
      <div className="flex h-screen">
         <Sidebar
            sessions={sessions}
            tagsForForm={tags}
            tasksForForm={tasks}
            day={day}
         />
      </div>
   );
}
