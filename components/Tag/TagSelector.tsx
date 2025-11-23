import { Tag } from "@/types";
import React, { useMemo, useState } from "react";
import TagBadge from "./TagBadge";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { Check, Palette, Plus, Search, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { CreateTag, DeleteTag } from "@/lib/Actions/Tag";

interface TagSelectorProps {
   AVBLtags: Omit<Tag, "createdAt">[];
   selectedTagsIds: number[];
   onTagChange: (tagIds: number[]) => void; // setSettagids
}

const TAG_COLORS = [
   "#8b5cf6", // purple
   "#ec4899", // pink
   "#06b6d4", // cyan
   "#ef4444", // red
   "#10b981", // green
   "#f59e0b", // amber
   "#6366f1", // indigo
   "#14b8a6", // teal
];

export default function TagSelector({
   AVBLtags,
   selectedTagsIds,
   onTagChange,
}: TagSelectorProps) {
   const [newTagName, setNewTagName] = useState("");
   const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
   const [isCreating, setIsCreating] = useState(false);
   const [isPopOpen, setisPopOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");

   const SelectedTags =
      selectedTagsIds &&
      AVBLtags.filter((tag) => selectedTagsIds.includes(tag.id));

   const filteredTags = useMemo(() => {
      if (!searchQuery.trim()) return AVBLtags;

      return AVBLtags.filter((tag) =>
         tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
   }, [AVBLtags, searchQuery]);

   const toggleTag = (tagId: number) => {
      if (selectedTagsIds.includes(tagId)) {
         onTagChange(selectedTagsIds.filter((id) => id !== tagId));
      } else {
         onTagChange([...selectedTagsIds, tagId]);
      }
   };

   //TODO: field-specific error &  transition
   //TODO: option to mark tag as primary

   const handleCreateTag = async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      await CreateTag({ name: newTagName, color: newTagColor });
      setIsCreating(false);
      setSearchQuery("");
      setNewTagName("");
   };
   return (
      <div className="flex flex-wrap gap-2 items-center">
         {SelectedTags &&
            SelectedTags.map((tag) => (
               <TagBadge
                  onRemove={() => toggleTag(tag.id)}
                  tag={tag}
                  key={tag.id}
               />
            ))}
         <Popover open={isPopOpen} onOpenChange={setisPopOpen}>
            <PopoverTrigger asChild>
               <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent rounded-lg"
               >
                  <Plus size={16} />
                  Add Tag
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="p-2.5 pt-3 bg-background rounded-xl border max-w-60"
               align="start"
            >
               {!isCreating ? (
                  <section className="space-y-3">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                 e.preventDefault();
                                 setNewTagName(searchQuery);
                                 setIsCreating(true);
                              }
                           }}
                           placeholder="Search or create tag…"
                           className="h-10 pl-9 text-sm"
                        />
                     </div>

                     <div className="space-y-1 max-h-64 overflow-y-auto ">
                        {AVBLtags.length === 0 ? (
                           <p className="text-sm text-muted-foreground text-center py-8">
                              No tags yet. Create one!
                           </p>
                        ) : filteredTags?.length === 0 ? (
                           <div className="text-center py-8 space-y-2">
                              <p className="text-sm text-muted-foreground">
                                 No tags found
                              </p>
                              <p className="text-xs text-muted-foreground font-medium">
                                 Press{" "}
                                 <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                                    Enter
                                 </kbd>{" "}
                                 to create "{searchQuery}"
                              </p>
                           </div>
                        ) : (
                           <>
                              {filteredTags?.map((tag) => {
                                 const isSelected = selectedTagsIds?.includes(
                                    tag.id
                                 );
                                 return (
                                    <div
                                       key={tag.id}
                                       className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
                                    >
                                       <div
                                          className="flex flex-1 items-center gap-2.5"
                                          onClick={() => toggleTag(tag.id)}
                                       >
                                          <div
                                             className="h-3 w-3 rounded-full shrink-0"
                                             style={{
                                                backgroundColor: tag.color,
                                             }}
                                          />
                                          <span className="text-sm font-medium">
                                             {tag.name}
                                          </span>
                                       </div>

                                       <div className="flex items-center gap-2">
                                          {isSelected && (
                                             <Check className="h-4 w-4 text-primary" />
                                          )}
                                          <button
                                             onClick={async (e) => {
                                                e.preventDefault();
                                                if (
                                                   confirm(
                                                      `Delete tag "${tag.name}"?`
                                                   )
                                                ) {
                                                   DeleteTag(tag.id);
                                                }
                                             }}
                                             className="opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                             <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                                          </button>
                                       </div>
                                    </div>
                                 );
                              })}
                           </>
                        )}
                     </div>
                  </section>
               ) : (
                  <section className="space-y-3">
                     <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                           Tag Name
                        </Label>
                        <Input
                           value={newTagName}
                           onChange={(e) => setNewTagName(e.target.value)}
                           onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                 handleCreateTag(e);
                              }
                              if (e.key === "Escape") {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 setIsCreating(false);
                                 setNewTagName("");
                                 setSearchQuery("");
                              }
                           }}
                           placeholder="Enter tag name"
                           className="h-10 text-sm"
                           autoFocus
                        />
                     </div>

                     <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                           Color
                        </Label>
                        <div className="flex gap-2 flex-wrap">
                           {TAG_COLORS.map((color) => (
                              <button
                                 key={color}
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setNewTagColor(color);
                                 }}
                                 className="h-9 w-9 rounded-lg border-2 transition-all hover:scale-110"
                                 style={{
                                    backgroundColor: color,
                                    borderColor:
                                       newTagColor === color
                                          ? "#FFFFFF"
                                          : "transparent",
                                 }}
                              />
                           ))}
                           <div className="relative">
                              <input
                                 type="color"
                                 value={newTagColor}
                                 className="h-9 w-9 rounded-lg border-3 border-dashed border-white cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                                 onChange={(e) =>
                                    setNewTagColor(e.target.value)
                                 }
                                 title="Custom color"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-2 pt-2">
                        <Button
                           size="sm"
                           onClick={handleCreateTag}
                           disabled={!newTagName.trim()}
                           className="flex-1 h-9"
                        >
                           Create Tag
                        </Button>
                        <Button
                           size="sm"
                           variant="outline"
                           onClick={() => {
                              setIsCreating(false);
                              setNewTagName("");
                              setSearchQuery("");
                           }}
                           className="flex-1 h-9"
                        >
                           Cancel
                        </Button>
                     </div>
                  </section>
               )}
            </PopoverContent>
         </Popover>
      </div>
   );
}
[];
