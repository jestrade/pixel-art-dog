import { describe, expect, it } from 'vitest'
import { canOccupy, overlaps } from './collision'
import { createWanderer, type Intent } from './controllers'
import { createDog, DOG_RUN_SPEED, DOG_SPEED, dogBody, stepDog } from './dog'
import { house } from './house'
import { seededRng } from './random'
import { createSession } from './session'

const FPS = 1 / 60
const RIGHT = { x: 1, y: 0 }

describe('running and blocking', () => {
  it('runs faster than it walks', () => {
    const start = createDog(house.dogSpawns[0].x, house.dogSpawns[0].y)
    let walking = start
    let running = start
    for (let i = 0; i < 30; i++) {
      walking = stepDog(walking, RIGHT, FPS, house)
      running = stepDog(running, RIGHT, FPS, house, { run: true })
    }
    expect(walking.x - start.x).toBeCloseTo(DOG_SPEED * 0.5, 0)
    expect(running.x - start.x).toBeCloseTo(DOG_RUN_SPEED * 0.5, 0)
    expect(running.running).toBe(true)
    expect(walking.running).toBe(false)
  })

  it('stops at another dog instead of overlapping it', () => {
    const start = createDog(house.dogSpawns[0].x, house.dogSpawns[0].y)
    const blocker = dogBody(start.x + 40, start.y)
    let dog = start
    for (let i = 0; i < 120; i++) dog = stepDog(dog, RIGHT, FPS, house, { blockers: [blocker] })
    expect(overlaps(dogBody(dog.x, dog.y), blocker)).toBe(false)
    expect(dog.x).toBeGreaterThan(start.x)
    expect(dog.moving).toBe(false)
  })
})

describe('wanderer', () => {
  it('walks, runs, jumps, barks, wags and sits over time', () => {
    const think = createWanderer(seededRng(1))
    const dog = createDog(0, 0)
    const seen = { walk: false, run: false, idle: false, actions: new Set<string>() }

    for (let i = 0; i < 60 * 300; i++) {
      const intent: Intent = think({ ...dog, moving: true }, FPS)
      const moving = intent.dir.x !== 0 || intent.dir.y !== 0
      if (moving && intent.run) seen.run = true
      else if (moving) seen.walk = true
      else seen.idle = true
      if (intent.action) seen.actions.add(intent.action)
    }

    expect(seen.walk && seen.run && seen.idle).toBe(true)
    expect([...seen.actions].sort()).toEqual(['bark', 'jump', 'sit', 'wag'])
  })

  it('picks a new direction when it is blocked', () => {
    const think = createWanderer(seededRng(7))
    const stuck = createDog(0, 0)
    const directions = new Set<string>()
    for (let i = 0; i < 60 * 30; i++) {
      const { dir } = think({ ...stuck, moving: false }, FPS)
      if (dir.x !== 0 || dir.y !== 0) directions.add(`${dir.x},${dir.y}`)
    }
    expect(directions.size).toBeGreaterThan(1)
  })
})

describe('session with several dogs', () => {
  it('starts five dogs on free, separate spots', () => {
    const session = createSession(house, seededRng(1))
    const dogs = session.getDogs()
    expect(dogs).toHaveLength(5)
    expect(new Set(dogs.map((d) => d.id)).size).toBe(5)
    for (const dog of dogs) expect(canOccupy(house, dogBody(dog.x, dog.y))).toBe(true)
    for (let i = 0; i < dogs.length; i++) {
      for (let j = i + 1; j < dogs.length; j++) {
        expect(overlaps(dogBody(dogs[i].x, dogs[i].y), dogBody(dogs[j].x, dogs[j].y))).toBe(false)
      }
    }
  })

  it('keeps every dog inside the house and apart from the others while they wander', () => {
    const session = createSession(house, seededRng(42))
    const startedAt = session.getDogs().map((d) => ({ x: d.x, y: d.y }))

    for (let i = 0; i < 60 * 120; i++) {
      session.update(FPS)
      const dogs = session.getDogs()
      for (const dog of dogs) expect(canOccupy(house, dogBody(dog.x, dog.y))).toBe(true)
      for (let a = 0; a < dogs.length; a++) {
        for (let b = a + 1; b < dogs.length; b++) {
          expect(overlaps(dogBody(dogs[a].x, dogs[a].y), dogBody(dogs[b].x, dogs[b].y))).toBe(false)
        }
      }
    }

    const dogs = session.getDogs()
    expect(dogs[0].x).toBe(startedAt[0].x) // the player's dog only moves when you press keys
    expect(dogs.slice(1).every((d, i) => d.x !== startedAt[i + 1].x || d.y !== startedAt[i + 1].y)).toBe(true)
  })

  it('changes a dog breed without touching the others', () => {
    const session = createSession(house, seededRng(1))
    const before = session.getDogs().map((d) => d.breed)
    session.setBreed(2, 'husky')
    session.setBreed(0, 'golden')
    const after = session.getDogs().map((d) => d.breed)
    expect(after[0]).toBe('golden')
    expect(after[2]).toBe('husky')
    expect(after[1]).toBe(before[1])
    expect(after[3]).toBe(before[3])
  })

  it('runs the player dog with Shift or the run lock', () => {
    const walk = createSession(house, seededRng(1))
    walk.keyDown('ArrowRight', false)
    walk.update(0.5)

    const shift = createSession(house, seededRng(1))
    shift.keyDown('ShiftLeft', false)
    shift.keyDown('ArrowRight', false)
    shift.update(0.5)

    const lock = createSession(house, seededRng(1))
    lock.setRunLock(true)
    lock.keyDown('ArrowRight', false)
    lock.update(0.5)

    const moved = (s: ReturnType<typeof createSession>) => s.getDog().x - house.dogSpawns[0].x
    expect(moved(shift)).toBeGreaterThan(moved(walk))
    expect(moved(lock)).toBeCloseTo(moved(shift), 5)
    expect(shift.getDog().running).toBe(true)
  })
})
