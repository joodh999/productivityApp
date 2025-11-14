import { dayService } from "@/lib/services/day-service";
import React from "react";

export default async function Content({ date }: { date: string | undefined }) {
   const targetDate = date ? new Date(date) : new Date();

   const day = await dayService.getorCreate(new Date("2025-10-11"));

   return <div className="flex h-screen"></div>;
}
