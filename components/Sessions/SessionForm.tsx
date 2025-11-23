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
import { generateTimeBlocks, localTimeToUTC } from "@/lib/utils";
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
import { start } from "repl";

interface sessionFormProps {
   time: string;
   session: sessionListItem | undefined;
   isOpen: boolean;
   onClose: () => void;
   tags: Omit<Tag, "createdAt">[];
   tasks: Pick<Task, "id" | "title">[];
}

export default function SessionForm({
   isOpen,
   onClose,
   time,
   session,
   tags,
   tasks,
}: sessionFormProps) {
   const [title, setTitle] = useState("");
   const [startTime, setStartTime] = useState("");
   const [endTime, setEndTime] = useState("");
   const [taskId, setTaskId] = useState("");
   const [note, setNote] = useState("");
   const [selectedTagIds, setSelctedTagIds] = useState<number[]>([]);
   const [isPending, startTransition] = useTransition();

   const timeBlocks = generateTimeBlocks();
   // const endTimePlaceholder = timeBlocks[timeBlocks.indexOf(time) + 1];

   useEffect(() => {
      if (session) {
         setTitle(session.title || "");
         setStartTime(time);
         setEndTime(timeBlocks[timeBlocks.indexOf(time) + 1]);
         setTaskId(String(session.task?.id) || "-1");
         setNote(session.note || "");
         setSelctedTagIds(session.tags.map((tag) => tag.id));
      } else {
         resetForm();

         setStartTime(time);
      }
   }, [isOpen]);

   const resetForm = (withtimeanddate?: boolean) => {
      setTitle("");
      if (withtimeanddate === true) {
         setStartTime("");
         setEndTime("");
      }
      setSelctedTagIds([]);
      setTaskId("-1");
      setNote("");
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const formStartTime = localTimeToUTC(session?.startTime, startTime);
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
                  <Select value={taskId} onValueChange={setTaskId}>
                     <SelectTrigger className="min-w-sm">
                        <SelectValue placeholder="None (standalone session)" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="-1">
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
                     <Button variant="destructive">Cancel Session</Button>
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
