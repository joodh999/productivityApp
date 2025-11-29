"use client";
import { Task, TaskWSubtasks } from "@/types";
import { format } from "date-fns";
import {
   Calendar,
   CheckCircle,
   CheckCircle2,
   ChevronDown,
   ChevronUp,
   Circle,
   EllipsisVertical,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TaskCardprops {
   task: TaskWSubtasks;
}
//TODO: onhover show remove (from today) , expend card, delete etc
//TODO: subtask and task completion

export default function TaskCard({ task }: TaskCardprops) {
   const [completed, setcompleted] = useState(task.completed);
   const [expended, setExpended] = useState(true);
   return (
      <main className="bg-card rounded-lg border hover:shadow-lg p-4">
         <section className="flex items-center justify-between ">
            <div className="flex items-start gap-3 flex-1">
               <button className="mt-1">
                  {completed ? (
                     <CheckCircle2 className="w-5 h-5 " />
                  ) : (
                     <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
               </button>
               <Link href={"a"}>
                  <h2 className="text-2xl font-semibold font-mono hover:underline">
                     {task.title}
                  </h2>
               </Link>
            </div>

            <button className="not-hover:opacity-0">
               {expended ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 " />
               ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
               )}
            </button>
            <button>
               <EllipsisVertical className="w-5 h-4 text-gray-600" />
            </button>
         </section>
         {task.description && (
            <p className="text-sm mb-3 ml-8 text-foreground/70">
               {task.description}
            </p>
         )}
         {task.dueDate && (
            <div className="flex items-center gap-1 ml-8 mb-3" title="Due date">
               <Calendar className="h-3 w-3 text-gray-400" />
               <span className="text-foreground/80 text-xs">
                  {format(task.dueDate, "dd MMMM")}
               </span>
            </div>
         )}

         {expended && task.subTasks.length > 0 && (
            <div className="ml-8 mt-3 space-y-2 border-t pt-3">
               <h3 className="text-sm  text-foreground/85 mb-2">Sub Tasks</h3>
               {task.subTasks.map((subTask) => (
                  <div key={subTask.id} className="flex items-center gap-2">
                     <button>
                        {subTask.completed ? (
                           <CheckCircle2 className="w-3 h-3 " />
                        ) : (
                           <Circle className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                        )}
                     </button>
                     <span
                        className={`text-sm  ${
                           subTask.completed ? "line-through " : "text-gray-400"
                        }`}
                     >
                        {subTask.title}
                     </span>
                  </div>
               ))}
            </div>
         )}
      </main>
   );
}
