import { sessionListItem, Tag, Task } from "@/types";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useState, useTransition } from "react";
import { blockToDate, generateTimeBlocks, localTimeToUTC } from "@/lib/utils";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "../ui/select";
import { ArrowRight } from "lucide-react";
import { Textarea } from "../ui/textarea";
import TagSelector from "../Tag/TagSelector";
import { Button } from "../ui/button";

import {
   CreateSessionInput,
   UpdateSessionInput,
} from "@/lib/validations/session-validation";
import { number, success } from "zod";
import {
   createSession,
   DeleteSession,
   updateSession,
} from "@/lib/Actions/session-actions";
import { Update } from "drizzle-orm";
import { Value } from "@radix-ui/react-select";
import { sessionService } from "@/lib/services/session-services";

interface sessionFormProps {
   time: string;
   session: sessionListItem | undefined;
   isOpen: boolean;
   onClose: () => void;
   tags: Omit<Tag, "createdAt">[];
   tasks: Pick<Task, "id" | "title">[];
   day: { id: number; date: string };
}

export default function SessionForm({
   isOpen,
   onClose,
   time,
   session,
   tags,
   tasks,
   day,
}: sessionFormProps) {
   const [title, setTitle] = useState("");
   const [startTime, setStartTime] = useState("");
   const [endTime, setEndTime] = useState("");
   const [taskId, setTaskId] = useState<number | null>();
   const [note, setNote] = useState("");
   const [selectedTagIds, setSelctedTagIds] = useState<number[]>([]);

   const [errors, setErros] = useState<Record<string, string[]>>({});
   const [generalError, setGeneralError] = useState<string>();
   const [isPending, startTransition] = useTransition();

   const timeBlocks = generateTimeBlocks();

   useEffect(() => {
      if (session) {
         setTitle(session.title || "");
         setStartTime(time);
         setEndTime(
            session.endTime.toLocaleString([], {
               hour: "2-digit",
               minute: "2-digit",
               hour12: false,
            })
         );
         setTaskId(session.task?.id || null);
         setNote(session.note || "");
         setSelctedTagIds(session.tags.map((tag) => tag.id));
      } else {
         resetForm();

         setStartTime(time);
         setEndTime(timeBlocks[timeBlocks.indexOf(time) + 1]);
      }
   }, [isOpen, session]);

   const resetForm = (withtimeanddate?: boolean) => {
      setTitle("");
      if (withtimeanddate === true) {
         setStartTime("");
         setEndTime("");
      }
      setSelctedTagIds([]);
      setTaskId(null);
      setNote("");
   };

   const handeldelsession = async (e: React.FormEvent, id: number) => {
      e.preventDefault();
      DeleteSession(id);
      onClose();
   };

   const handleSubmit = (e: React.FormEvent) => {
      //TODO: show error
      e.preventDefault();
      setErros({});
      setGeneralError(undefined);

      const date = new Date(day.date);
      const formStartTime = localTimeToUTC(date, startTime);
      const formEndTime = localTimeToUTC(date, endTime);

      startTransition(async () => {
         let result;
         if (session) {
            const updatedData: UpdateSessionInput = {};

            if (title !== session.title) updatedData.title = title;
            if (formStartTime.getTime() !== session.startTime.getTime())
               updatedData.startTime = formStartTime;
            if (formEndTime.getTime() !== session.endTime.getTime())
               updatedData.endTime = formEndTime;
            if (note.trim() !== (session.note || ""))
               updatedData.note = note || null;

            const existingTagIds = session.tags.map((t) => t.id).sort();
            const newTagIds = [...selectedTagIds].sort();
            if (JSON.stringify(existingTagIds) !== JSON.stringify(newTagIds)) {
               updatedData.tagIds = selectedTagIds;
            }

            if (Number(taskId) !== session.task?.id)
               updatedData.taskId = taskId;

            result = await updateSession(session.id, updatedData);
         } else {
            // Create
            const CreateData: CreateSessionInput = {
               title,
               startTime: formStartTime,
               endTime: formEndTime,
               note: note.trim() ? note : undefined,
               tagIds: selectedTagIds,
               taskId: taskId !== null ? Number(taskId) : undefined,
            };
            result = await createSession(day.id, CreateData);
         }

         if (!session) {
            resetForm();
            onClose();
         }

         console.log(result);
      });
   };
   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>
                  {session ? "Edit Session" : "Create New Session"}
               </DialogTitle>
            </DialogHeader>
            <form className="space-y-3.5">
               <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     placeholder="What are you working on?"
                  />
               </div>

               <div className="flex items-center w-max gap-4">
                  <div className="flex-1 space-y-2">
                     <Label>Start Time</Label>
                     <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger>
                           <SelectValue placeholder={time} />
                        </SelectTrigger>
                        <SelectContent>
                           {timeBlocks.map((b) => (
                              <SelectItem key={b} value={b}>
                                 {b}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <ArrowRight className="mt-3 shrink-0" />
                  <div className="flex-1 space-y-2">
                     <Label>End Time</Label>
                     <Select value={endTime} onValueChange={setEndTime}>
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {timeBlocks.map((b) => (
                              <SelectItem key={b} value={b}>
                                 {b}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <div className="space-y-3">
                  <Label>Link to Task</Label>
                  <Select
                     value={taskId === null ? "none" : String(taskId)}
                     onValueChange={(value) => {
                        if (value === "none") {
                           setTaskId(null);
                        } else {
                           setTaskId(Number(value));
                        }
                     }}
                  >
                     <SelectTrigger className="min-w-sm">
                        <SelectValue placeholder="None (standalone session)" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="none">
                           None (standalone session)
                        </SelectItem>
                        {tasks.map((task) => (
                           <SelectItem key={task.id} value={String(task.id)}>
                              {task.title}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <div className="space-y-3">
                  <Label>Notes</Label>
                  <Textarea
                     rows={4}
                     value={note}
                     onChange={(e) => setNote(e.target.value)}
                     placeholder="Add any notes about this session..."
                  />
               </div>

               <div className="space-y-3">
                  <Label>Tags</Label>
                  <TagSelector
                     AVBLtags={tags}
                     selectedTagsIds={selectedTagIds}
                     onTagChange={setSelctedTagIds}
                  />
               </div>

               <div className="flex justify-end gap-2">
                  {session && (
                     <Button
                        variant="destructive"
                        onClick={(e) => handeldelsession(e, session.id)}
                     >
                        Cancel Session
                     </Button>
                  )}

                  <Button
                     disabled={isPending || !title.trim() || !startTime}
                     onClick={handleSubmit}
                  >
                     {isPending
                        ? session
                           ? "Updating..."
                           : "Creating"
                        : session
                        ? "Update Session"
                        : "Create Session"}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
