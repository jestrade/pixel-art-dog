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

    const render = createHouseRenderer(house)

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
      () => render(ctx, session.getDogs().map(dogActor)),
    )

    return () => {
      stop()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [session])

  return (
    <canvas
      ref={ref}
      className="house-canvas"
      width={house.width}
      height={house.height}
      aria-label="Pixel art house with seven rooms and five dogs, one of which you can walk around"
    />
  )
}
