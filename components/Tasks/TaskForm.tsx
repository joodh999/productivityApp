"use client";
import React, { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { isPromise } from "util/types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DatePicker } from "../misc/DatePicker";

interface TaskFormProps {
   day: { id: number; date: string };
   isOpen: boolean;
   onClose: () => void;
}

// id: z.ZodOptional<z.ZodInt>;
//     title: z.ZodString;
//     description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
//     dueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
//     completed: z.ZodOptional<z.ZodBoolean>;
//     createdAt: z.ZodOptional<z.ZodDate>;
//     dayId: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
//     tagIds: z.ZodArray<z.ZodNumber>;

export default function TaskForm({ day, isOpen, onClose }: TaskFormProps) {
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [dueDate, setDueDate] = useState("");
   const [selectedTagIds, setSelctedTagIds] = useState<number[]>([]);
   const [dayId, setDayId] = useState("");

   const [errors, setErros] = useState<Record<string, string[]>>({});
   const [generalError, setGeneralError] = useState<string>();
   const [isPending, startTransition] = useTransition();

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
                     rows={2}
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="Describe your Task"
                  />
               </div>
               <div className="space-y-3 flex justify-between">
                  <DatePicker
                     label="Day"
                     // value={}
                     onChange={(d) =>
                        setDayId(d ? d.toISOString().split("T")[0] : "")
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
               <div></div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
