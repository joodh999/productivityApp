"use client";
import { Tag, Task, TaskWSubtasks } from "@/types";
import { isToday, parseISO, format } from "date-fns";
import { Button } from "../ui/button";
import TaskCard from "./TaskCard";
import { useState } from "react";
import TaskForm from "./TaskForm";

interface TaskListProps {
   Tasks: TaskWSubtasks[];
   day: { id: number; date: string };
   tagsForForm: Omit<Tag, "createdAt">[];
}

export default function TaskList({ Tasks, day, tagsForForm }: TaskListProps) {
   const ParsedDate = parseISO(day.date);
   const [isFormOpen, setFormOpen] = useState(false);

   const isToday = true; // for test

   return (
      <div className="p-5 min-w-4xl  ">
         {/* isToday(ParsedDate)  */}
         <header className="flex items-center justify-between">
            {isToday ? (
               <div className="">
                  <h1 className="text-4xl font-bold">Today</h1>
                  <p className="font-mono text-foreground/80 py-1 pl-1 text-xs">
                     {format(ParsedDate, "do, MMMM yyy")}
                  </p>
               </div>
            ) : (
               <div className="">
                  <h1 className="text-4xl font-bold">
                     {format(ParsedDate, "dd MMMM")}
                  </h1>
                  <p className="font-mono text-foreground/80 py-1 pl-1 text-xs underline">
                     go back to Today
                  </p>
               </div>
            )}
            <div>
               <Button onClick={() => setFormOpen(true)}>
                  Create New task
               </Button>
            </div>
         </header>

         <div className="pt-6 flex flex-col gap-3">
            {Tasks.map((task) => (
               <TaskCard task={task} key={task.id} />
            ))}
         </div>
         <TaskForm
            day={day}
            isOpen={isFormOpen}
            onClose={() => setFormOpen(false)}
            tags={tagsForForm}
         />
      </div>
   );
}
