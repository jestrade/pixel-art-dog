import { ACTIONS, type ActionKind } from './actions'
import type { Dog } from './dog'
import type { Direction } from './input'
import type { Rng } from './random'

/** What a dog wants to do this tick. */
export interface Intent {
  dir: Direction
  run: boolean
  /** An action to start now, or null. */
  action: ActionKind | null
}

/** Decides each dog's intent. The player's dog reads the keyboard; the others wander. */
export type Controller = (dog: Dog, dt: number) => Intent

const STILL: Direction = { x: 0, y: 0 }

const EIGHT_WAYS: Direction[] = Array.from({ length: 8 }, (_, i) => {
  const angle = (i * Math.PI) / 4
  return { x: Math.round(Math.cos(angle) * 1000) / 1000, y: Math.round(Math.sin(angle) * 1000) / 1000 }
})

type Mode = 'idle' | 'walk' | 'run'

/**
 * A dog that wanders on its own: it walks or runs in a direction for a while, then stops,
 * jumps, barks, wags or sits, and picks something new. If it is blocked for a moment
 * (a wall, furniture or another dog) it picks a new direction.
 */
export function createWanderer(rng: Rng): Controller {
  let mode: Mode = 'idle'
  let dir: Direction = STILL
  let timeLeft = 0.2 + rng()
  let blockedFor = 0

  const between = (min: number, max: number) => min + (max - min) * rng()
  const randomDirection = () => EIGHT_WAYS[Math.floor(rng() * EIGHT_WAYS.length)]

  return (dog, dt) => {
    timeLeft -= dt
    blockedFor = mode !== 'idle' && !dog.moving ? blockedFor + dt : 0

    let action: ActionKind | null = null

    if (timeLeft <= 0 || blockedFor > 0.25) {
      blockedFor = 0
      const roll = rng()
      if (roll < 0.28) {
        mode = 'walk'
        dir = randomDirection()
        timeLeft = between(1, 3)
      } else if (roll < 0.46) {
        mode = 'run'
        dir = randomDirection()
        timeLeft = between(0.8, 2)
      } else if (roll < 0.58) {
        mode = 'idle'
        timeLeft = between(0.6, 1.8)
      } else if (roll < 0.72) {
        action = 'jump' // jumping does not stop the dog, so it can hop while walking
        mode = rng() < 0.5 ? 'walk' : 'idle'
        dir = randomDirection()
        timeLeft = between(0.6, 1.5)
      } else if (roll < 0.86) {
        action = 'bark'
        mode = 'idle'
        timeLeft = (ACTIONS.bark.duration ?? 0) + between(0.2, 0.8)
      } else if (roll < 0.93) {
        action = 'wag'
        mode = 'idle'
        timeLeft = (ACTIONS.wag.duration ?? 0) + 0.2
      } else {
        action = 'sit' // stays seated until the next move cancels it
        mode = 'idle'
        timeLeft = between(2, 4)
      }
    }

    return { dir: mode === 'idle' ? STILL : dir, run: mode === 'run', action }
  }
}
