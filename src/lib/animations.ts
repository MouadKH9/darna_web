import type { Transition, Variants } from "framer-motion"

// Spring presets
export const springBouncy: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
}

export const springGentle: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 30,
}

// Easing presets
export const easeOutExpo: Transition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
}

export const easeOutBack: Transition = {
  duration: 0.5,
  ease: [0.34, 1.56, 0.64, 1],
}

// Reusable variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
}

export const scaleOnTap = {
  whileTap: { scale: 0.95 },
}

// Reduced motion helper
export const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false
