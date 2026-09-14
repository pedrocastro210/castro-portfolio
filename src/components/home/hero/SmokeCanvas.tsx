import { useEffect, useRef } from "react"
import { useReducedMotion } from "../../../lib/useReducedMotion"

type Wisp = {
  x: number
  y: number
  r: number
  driftX: number
  driftY: number
  phase: number
  hue: number
}

const WISP_COUNT = 14

export function SmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const wisps: Wisp[] = Array.from({ length: WISP_COUNT }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 90 + Math.random() * 140,
      driftX: (Math.random() - 0.5) * 0.15,
      driftY: (Math.random() - 0.5) * 0.15,
      phase: Math.random() * Math.PI * 2,
      hue: i % 2 === 0 ? 250 : 190,
    }))

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const handlePointerLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerleave", handlePointerLeave)

    // Sem isso, os 14 wisps continuam recriando um radial gradient por frame
    // (14 gradientes/frame) pra sempre, mesmo com a Hero fora da tela depois
    // que o usuário rola pro resto da página.
    let visible = true
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    visibilityObserver.observe(canvas)

    let raf = 0
    let t = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return

      t += 0.006
      ctx.clearRect(0, 0, width, height)

      for (const wisp of wisps) {
        wisp.x += wisp.driftX + Math.sin(t + wisp.phase) * 0.12
        wisp.y += wisp.driftY + Math.cos(t + wisp.phase) * 0.1

        if (wisp.x < -wisp.r) wisp.x = width + wisp.r
        if (wisp.x > width + wisp.r) wisp.x = -wisp.r
        if (wisp.y < -wisp.r) wisp.y = height + wisp.r
        if (wisp.y > height + wisp.r) wisp.y = -wisp.r

        const dx = wisp.x - mouseRef.current.x
        const dy = wisp.y - mouseRef.current.y
        const dist = Math.hypot(dx, dy)
        const influence = 160
        let drawX = wisp.x
        let drawY = wisp.y
        if (dist < influence) {
          const push = (1 - dist / influence) * 30
          const angle = Math.atan2(dy, dx)
          drawX += Math.cos(angle) * push
          drawY += Math.sin(angle) * push
        }

        const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, wisp.r)
        gradient.addColorStop(0, `hsla(${wisp.hue}, 70%, 70%, 0.05)`)
        gradient.addColorStop(1, "hsla(0, 0%, 0%, 0)")
        ctx.fillStyle = gradient
        ctx.fillRect(drawX - wisp.r, drawY - wisp.r, wisp.r * 2, wisp.r * 2)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      visibilityObserver.disconnect()
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen"
    />
  )
}
