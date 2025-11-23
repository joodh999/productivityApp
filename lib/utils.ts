import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function generateTimeBlocks() {
   const blocks = [];
   for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
         const time = `${hour.toString().padStart(2, "0")}:${min
            .toString()
            .padStart(2, "0")}`;
         blocks.push(time);
      }
   }
   return blocks;
}

export function isDatabaseError(
   error: unknown
): error is { code: string; message: string } {
   return (
      typeof error === "object" &&
      error !== null &&
      ("code" in error || "message" in error)
   );
}

export function blockToDate(block: string, day: Date): Date {
   const [hours, minutes] = block.split(":").map(Number);

   return new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      hours,
      minutes,
      0,
      0
   );
}

export function localTimeToUTC(date: Date, timeString: string): Date {
   const [hours, minutes] = timeString.split(":").map(Number);

   // Create Date in user's local timezone
   const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
      0,
      0
   );

   // Date object internally stores UTC timestamp
   // When serialized to JSON, becomes ISO string in UTC
   return localDate;
}
