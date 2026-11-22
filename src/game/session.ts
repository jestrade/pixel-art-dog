import { ACTION_BY_CODE, type ActionKind } from './actions'
import { DEFAULT_BREEDS, type BreedId } from './breeds'
import { createWanderer, type Controller } from './controllers'
import { createDog, dogBody, performAction, stepDog, type Dog } from './dog'
import { directionFromKeys, isRunHeld, MOVE_KEYS, type Direction } from './input'
import type { Rng } from './random'
import type { House } from './types'

/** Index of the dog the player controls. */
const PLAYER = 0

/**
 * One running game: every dog plus the keys currently held. Keyboard and on-screen buttons
 * both call `perform`, so an action behaves the same whichever way it was triggered.
 */
export interface Session {
  /** All dogs, the player's first. */
  getDogs(): readonly Dog[]
  /** The dog you control. */
  getDog(): Dog
  setBreed(id: number, breed: BreedId): void
  /** Steer the player's dog from a touch joystick: a unit vector, or zero to stop. Keys win when both are used. */
  setStick(dir: Direction): void
  /** Keep the player's dog running without holding a key (for touch screens). */
  setRunLock(on: boolean): void
  perform(kind: ActionKind): void
  /** Returns true when the key belongs to the game, so the caller can stop the browser reacting to it. */
  keyDown(code: string, repeat: boolean): boolean
  keyUp(code: string): void
  releaseAll(): void
  update(dt: number): void
}

interface Entry {
  dog: Dog
  controller: Controller
}

export function createSession(house: House, rng: Rng = Math.random): Session {
  const held = new Set<string>()
  let runLock = false
  let stick: Direction = { x: 0, y: 0 }

  const keyboard: Controller = () => {
    const keys = directionFromKeys(held)
    const usingKeys = keys.x !== 0 || keys.y !== 0
    return { dir: usingKeys ? keys : stick, run: runLock || isRunHeld(held), action: null }
  }

  const entries: Entry[] = house.dogSpawns.map((spawn, id) => ({
    dog: createDog(spawn.x, spawn.y, DEFAULT_BREEDS[id % DEFAULT_BREEDS.length], id),
    controller: id === PLAYER ? keyboard : createWanderer(rng),
  }))

  const perform = (kind: ActionKind) => {
    entries[PLAYER].dog = performAction(entries[PLAYER].dog, kind)
  }

  return {
    getDogs: () => entries.map((entry) => entry.dog),
    getDog: () => entries[PLAYER].dog,
    setBreed(id, breed) {
      const entry = entries[id]
      if (entry) entry.dog = { ...entry.dog, breed }
    },
    setStick(dir) {
      stick = dir
    },
    setRunLock(on) {
      runLock = on
    },
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
      for (const entry of entries) {
        const intent = entry.controller(entry.dog, dt)
        const dog = intent.action ? performAction(entry.dog, intent.action) : entry.dog
        const blockers = entries.filter((other) => other !== entry).map((other) => dogBody(other.dog.x, other.dog.y))
        entry.dog = stepDog(dog, intent.dir, dt, house, { run: intent.run, blockers })
      }
    },
  }
}
