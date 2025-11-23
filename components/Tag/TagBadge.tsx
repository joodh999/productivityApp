import { Tag } from "@/types";
import { Badge } from "../ui/badge";
import { Span } from "next/dist/trace";
import { X } from "lucide-react";
import { Button } from "../ui/button";

interface TagBadgeProps {
   tag: Omit<Tag, "createdAt">;
   onRemove: (tagId: number) => void;
}

export default function TagBadge({ tag, onRemove }: TagBadgeProps) {
   return (
      <Button
         variant={"outline"}
         className="
            gap-1 h-8 rounded-lg px-3 text-sm font-medium
            border border-white/20
            hover:border-white/40
            transition-all
         "
         style={{ backgroundColor: tag.color }}
         onClick={() => onRemove(tag.id)}
      >
         <span>{tag.name}</span>
         <X size={"4"} />
      </Button>
   );
}
