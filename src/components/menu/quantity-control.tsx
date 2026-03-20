"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, useSpring, useTransform } from "framer-motion"

interface QuantityControlProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantityControl({ value, onChange, min = 1, max = 20 }: QuantityControlProps) {
  const springValue = useSpring(value, { stiffness: 300, damping: 30 })
  const displayValue = useTransform(springValue, (v) => Math.round(v).toString())

  const handleDecrease = () => {
    const newValue = Math.max(min, value - 1)
    onChange(newValue)
    springValue.set(newValue)
  }

  const handleIncrease = () => {
    const newValue = Math.min(max, value + 1)
    onChange(newValue)
    springValue.set(newValue)
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={value <= min}
        className="h-10 w-10 rounded-full"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <motion.span className="min-w-[2ch] text-center text-xl font-bold tabular-nums">
        {displayValue}
      </motion.span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={value >= max}
        className="h-10 w-10 rounded-full"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
