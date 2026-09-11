import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useReducedMotion } from "../lib/useReducedMotion"

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
  scale?: number
}

export function Reveal({ children, delay = 0, className, y = 24, scale }: RevealProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: scale !== undefined ? 1 : undefined }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
