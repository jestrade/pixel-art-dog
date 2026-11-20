import { canOccupy } from './collision'
import type { Direction } from './input'
import type { House, Rect } from './types'

export type Facing = 'up' | 'down' | 'left' | 'right'

export interface Dog {
  /** Top-left of the body footprint, in world pixels. May be fractional. */
  x: number
  y: number
  facing: Facing
  moving: boolean
  /** Seconds spent walking; drives the walk animation. */
  walkClock: number
}

/** Size of the area the dog occupies on the floor (its paws), not of its sprite. */
export const DOG_BODY = { w: 12, h: 8 }

/** Walking speed in world pixels per second. */
export const DOG_SPEED = 64

export function createDog(x: number, y: number): Dog {
  return { x, y, facing: 'down', moving: false, walkClock: 0 }
}

export function dogBody(x: number, y: number): Rect {
  return { x: Math.round(x), y: Math.round(y), ...DOG_BODY }
}

/**
 * Advance the dog by `dt` seconds. Each axis is tried on its own, so a blocked axis
 * does not stop the other and the dog slides along walls and furniture.
 */
export function stepDog(dog: Dog, dir: Direction, dt: number, house: House): Dog {
  if (dir.x === 0 && dir.y === 0) return { ...dog, moving: false }

  let { x, y } = dog

  const nextX = x + dir.x * DOG_SPEED * dt
  if (canOccupy(house, dogBody(nextX, y))) x = nextX

  const nextY = y + dir.y * DOG_SPEED * dt
  if (canOccupy(house, dogBody(x, nextY))) y = nextY

  const moved = x !== dog.x || y !== dog.y
  const facing: Facing = dir.x !== 0 ? (dir.x < 0 ? 'left' : 'right') : dir.y < 0 ? 'up' : 'down'

  return { x, y, facing, moving: moved, walkClock: moved ? dog.walkClock + dt : 0 }
}
