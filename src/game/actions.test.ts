import { describe, expect, it } from 'vitest'
import { ACTIONS } from './actions'
import { createDog, performAction, stepDog } from './dog'
import { house } from './house'
import { createSession } from './session'

const FPS = 1 / 60
const RIGHT = { x: 1, y: 0 }
const STILL = { x: 0, y: 0 }
const spawn = () => createDog(house.dogSpawn.x, house.dogSpawn.y)

function run(dog: ReturnType<typeof spawn>, seconds: number, input = STILL) {
  let d = dog
  for (let i = 0; i < Math.round(seconds / FPS); i++) d = stepDog(d, input, FPS, house)
  return d
}

describe('actions', () => {
  it('starts an action and ends it after its duration', () => {
    const jumping = performAction(spawn(), 'jump')
    expect(jumping.action?.kind).toBe('jump')
    expect(run(jumping, ACTIONS.jump.duration! - 0.1).action).not.toBeNull()
    expect(run(jumping, ACTIONS.jump.duration! + 0.1).action).toBeNull()
  })

  it('ignores a new action while a timed one is running', () => {
    const jumping = performAction(spawn(), 'jump')
    expect(performAction(jumping, 'bark').action?.kind).toBe('jump')
  })

  it('lets the dog walk while jumping', () => {
    const dog = run(performAction(spawn(), 'jump'), 0.3, RIGHT)
    expect(dog.x).toBeGreaterThan(spawn().x)
  })

  it('keeps the dog still while barking', () => {
    const dog = run(performAction(spawn(), 'bark'), 0.3, RIGHT)
    expect(dog.x).toBe(spawn().x)
    expect(dog.moving).toBe(false)
  })

  it('sits until told to stand, or until the dog walks', () => {
    const sitting = performAction(spawn(), 'sit')
    expect(run(sitting, 5).action?.kind).toBe('sit')
    expect(performAction(sitting, 'sit').action).toBeNull() // second press stands up

    const walking = run(sitting, 0.2, RIGHT)
    expect(walking.action).toBeNull()
    expect(walking.x).toBeGreaterThan(spawn().x)
  })

  it('lets another action replace a sit', () => {
    expect(performAction(performAction(spawn(), 'sit'), 'bark').action?.kind).toBe('bark')
  })
})

describe('session', () => {
  it('triggers actions from keys but not from key repeat', () => {
    const session = createSession(house)
    expect(session.keyDown('Space', false)).toBe(true)
    expect(session.getDog().action?.kind).toBe('jump')

    session.update(1) // jump finishes
    session.keyDown('Space', true) // the key is still held down
    expect(session.getDog().action).toBeNull()
  })

  it('moves the dog from held keys and reports unrelated keys as unhandled', () => {
    const session = createSession(house)
    expect(session.keyDown('KeyZ', false)).toBe(false)
    session.keyDown('ArrowRight', false)
    session.update(0.5)
    expect(session.getDog().x).toBeGreaterThan(house.dogSpawn.x)
    session.keyUp('ArrowRight')
    const stoppedAt = session.getDog().x
    session.update(0.5)
    expect(session.getDog().x).toBe(stoppedAt)
  })

  it('runs the same action from a button as from a key', () => {
    const session = createSession(house)
    session.perform('bark')
    expect(session.getDog().action?.kind).toBe('bark')
  })
})
