import { useEffect, useRef } from 'react'
import { house } from '../game/house'
import type { Session } from '../game/session'
import { createHouseRenderer } from '../render/drawHouse'
import { dogActor } from '../render/dogSprite'
import { startLoop } from './gameLoop'

export function GameCanvas({ session }: { session: Session }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return

    const canvas = ctx.canvas
    const render = createHouseRenderer(house)

    // Keep the canvas's pixel size equal to its on-screen size, so the picture is drawn sharp at any window size.
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio))
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return // leave browser shortcuts alone
      if (e.target instanceof HTMLSelectElement) return // arrow keys belong to the breed picker while it has focus
      if (session.keyDown(e.code, e.repeat)) e.preventDefault() // e.g. keep Space and arrows from scrolling
    }
    const onKeyUp = (e: KeyboardEvent) => session.keyUp(e.code)
    const onBlur = () => session.releaseAll() // a key released while the window is unfocused never sends keyup

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)

    const stop = startLoop(
      (dt) => session.update(dt),
      () => render(ctx, session.getDogs().map(dogActor), session.getView()),
    )

    return () => {
      stop()
      observer.disconnect()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [session])

  return (
    <canvas
      ref={ref}
      className="house-canvas"
      aria-label="Pixel art house with a patio and a garden, and five dogs, one of which you can walk around"
    />
  )
}
