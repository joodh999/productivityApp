import Sidebar from "@/components/Sessions/Sidebar";
import TaskList from "@/components/Tasks/TaskList";
import { dayService } from "@/lib/services/day-service";
import { sessionService } from "@/lib/services/session-services";
import { tagService } from "@/lib/services/tag-service";
import { taskService } from "@/lib/services/task-service";

export default async function Content({ date }: { date: string | undefined }) {
   const targetDate = date ? new Date(date) : new Date();

   const day = await dayService.getorCreate(new Date("2025-10-11"));
   const sessions = await sessionService.getListbyDay(day.id);
   const tags = await tagService.getAllTagsForSessionForm();
   const tasks = await taskService.getTasksforSessionForm();

   const tasklistTask = await taskService.getTaskForDay(day);

   return (
      <div className="flex h-screen">
         <Sidebar
            sessions={sessions}
            tagsForForm={tags}
            tasksForForm={tasks}
            day={day}
         />
         <div>
            <header className="justify-end h-10"></header>
            <TaskList day={day} Tasks={tasklistTask} />
         </div>
         <div className="w-64"></div>
      </div>
   );
}
