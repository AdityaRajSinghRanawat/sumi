import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface InlineRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
  startOnView?: boolean
}

export function InlineReveal({
  children,
  className,
  delay = 0,
  duration = 0.45,
  once = true,
  startOnView = true,
}: InlineRevealProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 12, filter: "blur(8px)", clipPath: "inset(0 100% 0 0)" }}
      animate={!startOnView ? { opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0 0% 0 0)" } : undefined}
      whileInView={startOnView ? { opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0 0% 0 0)" } : undefined}
      viewport={{ once }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  )
}
