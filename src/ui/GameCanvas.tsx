import { useEffect, useRef, useState } from 'react'
import { createDog, stepDog } from '../game/dog'
import { house } from '../game/house'
import { directionFromKeys, MOVE_KEYS } from '../game/input'
import { createHouseRenderer } from '../render/drawHouse'
import { dogActor } from '../render/dogSprite'
import { startLoop } from './gameLoop'

/** Largest whole-number zoom that fits the window, so pixels stay square and crisp. */
function fitScale(): number {
  const fit = Math.min((window.innerWidth - 24) / house.width, (window.innerHeight - 110) / house.height)
  return Math.max(1, Math.floor(fit))
}

export function GameCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [scale, setScale] = useState(fitScale)

  useEffect(() => {
    const onResize = () => setScale(fitScale())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return

    const render = createHouseRenderer(house)
    const held = new Set<string>()
    let dog = createDog(house.dogSpawn.x, house.dogSpawn.y)

    const onKeyDown = (e: KeyboardEvent) => {
      if (!MOVE_KEYS.has(e.code)) return
      e.preventDefault() // keep arrow keys from scrolling the page
      held.add(e.code)
    }
    const onKeyUp = (e: KeyboardEvent) => held.delete(e.code)
    const onBlur = () => held.clear() // a key released while the window is unfocused never sends keyup

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)

    const stop = startLoop(
      (dt) => {
        dog = stepDog(dog, directionFromKeys(held), dt, house)
      },
      () => render(ctx, [dogActor(dog)]),
    )

    return () => {
      stop()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="house-canvas"
      width={house.width}
      height={house.height}
      style={{ width: house.width * scale, height: house.height * scale }}
      aria-label="Pixel art house with a bedroom, a living room and an entry, and a Yorkshire Terrier you can walk around"
    />
  )
}
