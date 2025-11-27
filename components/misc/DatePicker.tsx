import { useState } from "react";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

interface DatePickerProps {
   label: string;
   value?: Date;
   onChange: (date?: Date) => void;
}
export function DatePicker({ label, value, onChange }: DatePickerProps) {
   const [open, setOpen] = useState(false);

   return (
      <div className="flex flex-col gap-3">
         <Label className="px-1">{label}</Label>

         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  variant="outline"
                  className="w-48 justify-between font-normal"
               >
                  {value ? value.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
               </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                  mode="single"
                  selected={value}
                  captionLayout="dropdown"
                  onSelect={(selected) => {
                     onChange(selected);
                     setOpen(false);
                  }}
               />
            </PopoverContent>
         </Popover>
      </div>
   );
}
