import Sidebar from "@/components/Sessions/Sidebar";
import TaskList from "@/components/Tasks/TaskList";
import { dayService } from "@/lib/services/day-service";
import { sessionService } from "@/lib/services/session-services";
import { tagService } from "@/lib/services/tag-service";
import { taskService } from "@/lib/services/task-service";

export default async function Content({ date }: { date: string | undefined }) {
   const targetDate = date ? new Date(date) : new Date();

   const day = await dayService.getorCreate(new Date("2025-11-11"));
   const sessions = await sessionService.getListbyDay(day.id);
   const tags = await tagService.getAllTagsForSessionForm();
   const tasks = await taskService.getTasksforSessionForm();

   const tasklistTask = await taskService.getTaskForDay(day);

   return (
      <div className="flex h-screen overflow-y-hidden">
         <Sidebar
            sessions={sessions}
            tagsForForm={tags}
            tasksForForm={tasks}
            day={day}
         />
         <div className="overflow-y-scroll">
            <header className="justify-end h-10">header</header>
            <TaskList day={day} Tasks={tasklistTask} tagsForForm={tags} />
         </div>
         <div className="w-64"></div>
      </div>
   );
}
