"use client"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

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
        <TabButton
          active={selected === null}
          onClick={() => onSelect(null)}
          label="Tout"
        />
        {categories.map((category) => (
          <TabButton
            key={category}
            active={selected === category}
            onClick={() => onSelect(category)}
            label={category}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex items-center rounded-full px-5 py-2.5 text-[15px] font-medium transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]"
          : "bg-card/80 backdrop-blur-sm border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"
      )}
    >
      {label}
    </motion.button>
  )
}
