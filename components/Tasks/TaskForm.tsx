"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DatePicker } from "../misc/DatePicker";
import TagSelector from "../Tag/TagSelector";
import { Tag } from "@/types";
import { Button } from "../ui/button";
import { insertTaskWTags } from "@/lib/validations/task-validation";
import { createTaskAction } from "@/lib/Actions/task-actions";

interface TaskFormProps {
   day: { id: number; date: string };
   isOpen: boolean;
   onClose: () => void;
   tags: Omit<Tag, "createdAt">[];
}

export default function TaskForm({
   day: DayProp,
   isOpen,
   onClose,
   tags,
}: TaskFormProps) {
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [dueDate, setDueDate] = useState("");
   const [day, setDay] = useState("");
   const [selectedTagIds, setSelctedTagIds] = useState<number[]>([]);

   const [errors, setErros] = useState<Record<string, string[]>>({});
   const [generalError, setGeneralError] = useState<string>();
   const [isPending, startTransition] = useTransition();

   const resetForm = () => {
      setTitle("");
      setDescription("");
      setDueDate("");
      setDay(new Date(DayProp.date).toISOString().split("T")[0]);
   };

   useEffect(() => {
      resetForm();
   }, []);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log(dueDate);

      startTransition(async () => {
         const CreateData: insertTaskWTags = {
            title: title,
            description: description,
            tagIds: selectedTagIds,
            dueDate: dueDate,
         };
         const result = await createTaskAction(CreateData, day);

         if (result.sucess) {
            onClose();
            resetForm();
         }
         console.log("Failed to create task ", result);
      });
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Create New Task</DialogTitle>
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
               <div className="space-y-3">
                  <Label>Description</Label>
                  <Textarea
                     rows={4}
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="Describe your Task"
                  />
               </div>
               <div className="space-y-3 flex justify-between">
                  <DatePicker
                     label="Day"
                     value={day ? new Date(day) : new Date(DayProp.date)}
                     onChange={(d) =>
                        setDay(d ? d.toISOString().split("T")[0] : "")
                     }
                  />
                  <DatePicker
                     label="Due Date"
                     value={dueDate ? new Date(dueDate) : undefined}
                     onChange={(d) =>
                        setDueDate(d ? d.toISOString().split("T")[0] : "")
                     }
                  />
               </div>
               <div>
                  <TagSelector
                     AVBLtags={tags}
                     onTagChange={setSelctedTagIds}
                     selectedTagsIds={selectedTagIds}
                  />
               </div>

               <div className="flex justify-end">
                  <Button onClick={handleSubmit}>
                     {isPending ? "Creating..." : "Create"}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
