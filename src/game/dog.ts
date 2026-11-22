import { ACTIONS, type ActionKind } from './actions'
import type { BreedId } from './breeds'
import { canOccupy } from './collision'
import type { Direction } from './input'
import type { House, Rect } from './types'

export type Facing = 'up' | 'down' | 'left' | 'right'

/** An action in progress and how long it has been running. */
export interface ActiveAction {
  kind: ActionKind
  elapsed: number
}

export interface Dog {
  /** Index of this dog in the house, 0 for the player's dog. */
  id: number
  breed: BreedId
  /** Top-left of the body footprint, in world pixels. May be fractional. */
  x: number
  y: number
  facing: Facing
  moving: boolean
  /** Moving at running speed. */
  running: boolean
  /** Seconds spent walking; drives the walk animation. */
  walkClock: number
  /** What the dog is doing besides walking, or null when it is free. */
  action: ActiveAction | null
}

/** Size of the area the dog occupies on the floor (its paws), not of its sprite. */
export const DOG_BODY = { w: 12, h: 8 }

/** Walking speed in world pixels per second. */
export const DOG_SPEED = 64

/** Running speed in world pixels per second. */
export const DOG_RUN_SPEED = 112

export function createDog(x: number, y: number, breed: BreedId = 'cream', id = 0): Dog {
  return { id, breed, x, y, facing: 'down', moving: false, running: false, walkClock: 0, action: null }
}

export function dogBody(x: number, y: number): Rect {
  return { x: Math.round(x), y: Math.round(y), ...DOG_BODY }
}

/**
 * Ask the dog to start an action. Ignored while another timed action is running.
 * Sitting is a pose that lasts until the dog stands up: asking to sit again stands it up,
 * and any other action replaces it.
 */
export function performAction(dog: Dog, kind: ActionKind): Dog {
  if (dog.action === null) return { ...dog, action: { kind, elapsed: 0 } }
  if (dog.action.kind !== 'sit') return dog
  return { ...dog, action: kind === 'sit' ? null : { kind, elapsed: 0 } }
}

/** Move the running action forward and drop it when its time is up. */
function advanceAction(action: ActiveAction | null, dt: number): ActiveAction | null {
  if (action === null) return null
  const elapsed = action.elapsed + dt
  const { duration } = ACTIONS[action.kind]
  return duration !== null && elapsed >= duration ? null : { kind: action.kind, elapsed }
}

const STILL: Direction = { x: 0, y: 0 }

export interface StepOptions {
  /** Move at running speed instead of walking speed. */
  run?: boolean
  /** Other bodies the dog must not overlap, such as other dogs. */
  blockers?: readonly Rect[]
}

/**
 * Advance the dog by `dt` seconds. Each axis is tried on its own, so a blocked axis
 * does not stop the other and the dog slides along walls and furniture.
 */
export function stepDog(dog: Dog, input: Direction, dt: number, house: House, options: StepOptions = {}): Dog {
  const { run = false, blockers = [] } = options
  let action = advanceAction(dog.action, dt)
  let dir = input
  const wantsToMove = input.x !== 0 || input.y !== 0

  if (action !== null && ACTIONS[action.kind].locksMovement) {
    if (wantsToMove && ACTIONS[action.kind].endsOnMove) action = null
    else dir = STILL
  }

  if (dir.x === 0 && dir.y === 0) return { ...dog, action, moving: false, running: false }

  let { x, y } = dog
  const speed = run ? DOG_RUN_SPEED : DOG_SPEED

  const nextX = x + dir.x * speed * dt
  if (canOccupy(house, dogBody(nextX, y), blockers)) x = nextX

  const nextY = y + dir.y * speed * dt
  if (canOccupy(house, dogBody(x, nextY), blockers)) y = nextY

  const moved = x !== dog.x || y !== dog.y
  // Face along the stronger axis; a tie (a perfect diagonal) faces sideways.
  const facing: Facing =
    Math.abs(dir.x) >= Math.abs(dir.y) ? (dir.x < 0 ? 'left' : 'right') : dir.y < 0 ? 'up' : 'down'

  return {
    ...dog,
    x,
    y,
    facing,
    action,
    moving: moved,
    running: moved && run,
    walkClock: moved ? dog.walkClock + dt : 0,
  }
}
