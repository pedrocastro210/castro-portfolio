import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useReducedMotion } from "../../../lib/useReducedMotion"

type TiltCardProps = {
  src: string
  alt: string
  className?: string
}

export function TiltCard({ src, alt, className = "aspect-[3/4] w-full" }: TiltCardProps) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const springX = useSpring(mx, { stiffness: 150, damping: 18 })
  const springY = useSpring(my, { stiffness: 150, damping: 18 })

  const rotateX = useTransform(springY, [0, 1], [10, -10])
  const rotateY = useTransform(springX, [0, 1], [-10, 10])
  const glareX = useTransform(springX, [0, 1], ["0%", "100%"])
  const glareY = useTransform(springY, [0, 1], ["0%", "100%"])

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((event.clientX - rect.left) / rect.width)
    my.set((event.clientY - rect.top) / rect.height)
  }

  const handleLeave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <div className="h-full w-full" style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={reducedMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative overflow-hidden rounded-2xl border border-line shadow-2xl ${className}`}
      >
        <img src={src} alt={alt} className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover" />

        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(10,10,13,0.55) 0%, transparent 45%)" }}
        />

        {!reducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, rgba(255,255,255,0.16), transparent 55%)",
              left: glareX,
              top: glareY,
              width: "160%",
              height: "160%",
              x: "-30%",
              y: "-30%",
            }}
          />
        )}
      </motion.div>
    </div>
  )
}
