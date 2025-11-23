"use client";
import { blockToDate, generateTimeBlocks } from "@/lib/utils";
import { sessionListItem, Tag, Task } from "@/types";
import SessionCard from "./SessionCard";
import SessionForm from "./SessionForm";
import { useState } from "react";

interface SidebarProps {
   sessions: sessionListItem[];
   tasksForForm: Pick<Task, "id" | "title">[];
   tagsForForm: Omit<Tag, "createdAt">[];
}

export default function Sidebar({
   sessions,
   tasksForForm,
   tagsForForm,
}: SidebarProps) {
   const [isFormOpen, setFormOpen] = useState(false);
   const [selectedSession, setSelectedSession] = useState<
      sessionListItem | undefined
   >();
   const [selectedTime, setSelectedTime] = useState("");

   const timeBlocks = generateTimeBlocks();
   const day = sessions[0].startTime; //TODO: maybe this may not exits, for new day
   const blockduration = 30 * 60 * 1000; // in ms

   const handleFormClose = () => {
      setFormOpen(false);
   };
   const handleFormOpen = (
      time: string,
      session: sessionListItem | undefined
   ) => {
      setSelectedSession(session);
      setSelectedTime(time);
      setFormOpen(true);
   };

   // console.log(JSON.stringify(sessions).length / 1024, "KB");
   return (
      <div className="w-64 border-r overflow-y-scroll">
         <div className="p-2 space-y-0.5">
            {timeBlocks.map((b) => {
               const timeblock = blockToDate(b, day);
               const block = timeblock.toLocaleString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
               });

               const sesh = sessions.find((s) => {
                  return (
                     timeblock.getTime() >= s.startTime.getTime() &&
                     timeblock.getTime() < s.endTime.getTime()
                  );
               });

               const isCont = sesh
                  ? timeblock.getTime() > sesh.startTime.getTime()
                  : false;

               const isLastBlock = sesh
                  ? timeblock.getTime() + blockduration >=
                    sesh.endTime.getTime()
                  : false;

               return (
                  <SessionCard
                     key={block}
                     session={sesh}
                     time={block}
                     isCont={isCont}
                     isLast={isLastBlock}
                     onClick={() => handleFormOpen(block, sesh)}
                  />
               );
            })}
            <SessionForm
               isOpen={isFormOpen}
               onClose={handleFormClose}
               time={selectedTime}
               session={selectedSession}
               tags={tagsForForm}
               tasks={tasksForForm}
            />
         </div>
      </div>
   );
}
