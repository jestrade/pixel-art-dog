import { ACTION_BY_CODE, type ActionKind } from './actions'
import { DEFAULT_BREEDS, type BreedId } from './breeds'
import { houseView, roomContaining, roomView, stepView } from './camera'
import { createWanderer, type Controller } from './controllers'
import { createDog, DOG_BODY, dogBody, performAction, stepDog, type Dog } from './dog'
import { directionFromKeys, isRunHeld, MOVE_KEYS, type Direction } from './input'
import type { Rng } from './random'
import type { House, Rect } from './types'

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
  /** The part of the world on screen. Moves smoothly toward the whole house, or toward the player's room when zoomed. */
  getView(): Rect
  /** Zoom in on the room the player's dog is in (it follows the dog from room to room), or back out to the whole house. */
  setZoom(on: boolean): void
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
  let zoomed = false
  let view: Rect = houseView(house)

  const keyboard: Controller = () => {
    const keys = directionFromKeys(held)
    const usingKeys = keys.x !== 0 || keys.y !== 0
    return { dir: usingKeys ? keys : stick, run: runLock || isRunHeld(held), action: null }
  }

  const entries: Entry[] = house.dogSpawns.map((spawn, id) => ({
    dog: createDog(spawn.x, spawn.y, DEFAULT_BREEDS[id % DEFAULT_BREEDS.length], id),
    controller: id === PLAYER ? keyboard : createWanderer(rng),
  }))

  const centerOf = (dog: Dog) => ({ x: dog.x + DOG_BODY.w / 2, y: dog.y + DOG_BODY.h / 2 })
  const start = centerOf(entries[PLAYER].dog)
  let playerRoom = roomContaining(house, start.x, start.y) ?? house.rooms[0]

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
    getView: () => view,
    setZoom(on) {
      zoomed = on
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

      // In a doorway the dog is in no room, so the view stays on the last room it was in.
      const at = centerOf(entries[PLAYER].dog)
      playerRoom = roomContaining(house, at.x, at.y) ?? playerRoom
      view = stepView(view, zoomed ? roomView(playerRoom) : houseView(house), dt)
    },
  }
}
