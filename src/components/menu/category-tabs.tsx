"use client"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface CategoryTabsProps {
  categories: string[]
  selected: string | null
  onSelect: (category: string | null) => void
}

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  if (categories.length === 0) return null

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
            selected === null
              ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
          )}
        >
          Tout
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cn(
              "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
              selected === category
                ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
