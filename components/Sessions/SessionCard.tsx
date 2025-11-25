"use client";
import { sessionListItem } from "@/types";
import { CornerDownRight, CornerLeftUp } from "lucide-react";
interface SessionCardProps {
   time: string;
   session: sessionListItem | undefined;
   onClick: () => void;
   isCont: boolean;
   isLast: boolean;
}

//TODO: make the current time somewhat pop out
// scroll down to current session card
// some color

export default function SessionCard({
   time,
   session,
   onClick,
   isCont,
   isLast,
}: SessionCardProps) {
   const sessionTag = session?.tags.find((tag) => tag.isSession);

   return (
      <div
         onClick={onClick}
         className="flex flex-col py-2.5 px-3 text-sm hover:opacity-90 transition-all cursor-pointer border-l-4"
         style={sessionTag ? { borderLeftColor: sessionTag.color } : undefined}
      >
         <div className="flex items-center justify-between">
            <span className="font-mono text-foreground/80 font-medium">
               {time}
            </span>
            <span className="text-md text-muted-foreground">
               {!isCont && session?.title}
            </span>
         </div>

         {isLast && (
            <div className="flex items-center gap-2 mt-1.5 justify-between">
               {session?.task && (
                  <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                     <CornerDownRight size={10} />
                     {/* {session.task.title} */}
                     {session?.task?.title}
                  </span>
               )}
            </div>
         )}
      </div>
   );
}
