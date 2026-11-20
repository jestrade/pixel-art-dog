import { ACTION_BY_CODE, type ActionKind } from './actions'
import { createDog, performAction, stepDog, type Dog } from './dog'
import { directionFromKeys, MOVE_KEYS } from './input'
import type { House } from './types'

/**
 * One running game: the dog plus the keys currently held. Keyboard and on-screen buttons
 * both call `perform`, so an action behaves the same whichever way it was triggered.
 */
export interface Session {
  getDog(): Dog
  perform(kind: ActionKind): void
  /** Returns true when the key belongs to the game, so the caller can stop the browser reacting to it. */
  keyDown(code: string, repeat: boolean): boolean
  keyUp(code: string): void
  releaseAll(): void
  update(dt: number): void
}

export function createSession(house: House): Session {
  let dog = createDog(house.dogSpawn.x, house.dogSpawn.y)
  const held = new Set<string>()

  const perform = (kind: ActionKind) => {
    dog = performAction(dog, kind)
  }

  return {
    getDog: () => dog,
    perform,
    keyDown(code, repeat) {
      if (MOVE_KEYS.has(code)) {
        held.add(code)
        return true
      }
      const kind = ACTION_BY_CODE.get(code)
      if (kind === undefined) return false
      if (!repeat) perform(kind) // holding the key down must not retrigger the action
      return true
    },
    keyUp: (code) => void held.delete(code),
    releaseAll: () => held.clear(),
    update(dt) {
      dog = stepDog(dog, directionFromKeys(held), dt, house)
    },
  }
}
