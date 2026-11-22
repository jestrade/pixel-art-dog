import { useEffect, useRef, useState, type PointerEvent } from 'react'
import type { Session } from '../game/session'

/** How far the knob can travel from the center, in CSS pixels. */
const RADIUS = 48
/** Pushes shorter than this do nothing, so a resting thumb does not move the dog. */
const DEAD_ZONE = 12

const ZERO = { x: 0, y: 0 }

/** On-screen stick for touch devices. Drag anywhere around it; the dog walks toward the knob. */
export function Joystick({ session }: { session: Session }) {
  const base = useRef<HTMLDivElement>(null)
  const activePointer = useRef<number | null>(null)
  const [knob, setKnob] = useState(ZERO)

  useEffect(() => () => session.setStick(ZERO), [session]) // never leave the dog walking if the stick goes away

  const steer = (e: PointerEvent) => {
    const rect = base.current!.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(dx, dy)
    const pull = distance > RADIUS ? RADIUS / distance : 1
    setKnob({ x: dx * pull, y: dy * pull })
    session.setStick(distance < DEAD_ZONE ? ZERO : { x: dx / distance, y: dy / distance })
  }

  const release = (e: PointerEvent) => {
    if (activePointer.current !== e.pointerId) return
    activePointer.current = null
    setKnob(ZERO)
    session.setStick(ZERO)
  }

  return (
    <div
      ref={base}
      className="joystick"
      role="application"
      aria-label="Move the dog"
      onPointerDown={(e) => {
        if (activePointer.current !== null) return // one finger steers; ignore extra touches
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId) // keep receiving moves when the finger slides off the stick
        activePointer.current = e.pointerId
        steer(e)
      }}
      onPointerMove={(e) => {
        if (activePointer.current === e.pointerId) steer(e)
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      <div
        className="joystick-knob"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  )
}
