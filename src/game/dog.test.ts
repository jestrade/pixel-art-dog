import { describe, expect, it } from 'vitest'
import { canOccupy } from './collision'
import { createDog, DOG_SPEED, dogBody, stepDog, type Dog } from './dog'
import { house } from './house'
import { directionFromKeys } from './input'
import type { Direction } from './input'
import type { Rect } from './types'

const FPS = 1 / 60

/** Run the dog for `seconds` of game time holding one direction. */
function walk(start: Dog, dir: Direction, seconds: number): Dog {
  let dog = start
  for (let i = 0; i < Math.round(seconds / FPS); i++) dog = stepDog(dog, dir, FPS, house)
  return dog
}

const spawn = () => createDog(house.dogSpawns[0].x, house.dogSpawns[0].y)

describe('stepDog', () => {
  it('starts on a free spot', () => {
    expect(canOccupy(house, dogBody(spawn().x, spawn().y))).toBe(true)
  })

  it('moves at the dog speed on open floor', () => {
    const dog = walk(spawn(), { x: 1, y: 0 }, 0.5)
    expect(dog.x - spawn().x).toBeCloseTo(DOG_SPEED * 0.5, 0)
    expect(dog.facing).toBe('right')
    expect(dog.moving).toBe(true)
  })

  it('stays put and idles without input', () => {
    const dog = stepDog(spawn(), { x: 0, y: 0 }, FPS, house)
    expect(dog.x).toBe(spawn().x)
    expect(dog.moving).toBe(false)
  })

  it('never ends up inside a wall or furniture', () => {
    for (const dir of [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }]) {
      const dog = walk(spawn(), dir, 20)
      expect(canOccupy(house, dogBody(dog.x, dog.y))).toBe(true)
    }
  })

  it('stops at the sofa', () => {
    const sofa = house.furniture.find((f) => f.id === 'sofa')!.footprint as Rect
    const start = createDog(sofa.x + 20, sofa.y + sofa.h + 30)
    const dog = walk(start, { x: 0, y: -1 }, 5)
    expect(dog.y).toBeGreaterThanOrEqual(sofa.y + sofa.h - 0.5)
    expect(dog.moving).toBe(false)
  })

  it('slides along a wall when moving diagonally into it', () => {
    const sofa = house.furniture.find((f) => f.id === 'sofa')!.footprint as Rect
    const start = createDog(sofa.x + 20, sofa.y + sofa.h + 4)
    const dog = walk(start, directionFromKeys(new Set(['ArrowUp', 'ArrowRight'])), 0.3)
    expect(dog.x).toBeGreaterThan(start.x)
  })

  it('walks from the living room into the master bedroom and the kitchen', () => {
    // Bedroom doorway is at tile x 1..4; kitchen doorway is at tile y 16..19 on the x = 16 partition.
    const toBedroom = walk(createDog(24, 256), { x: 0, y: -1 }, 3)
    expect(toBedroom.y).toBeLessThan(144) // above the living room wall line, so inside the bedroom

    const toKitchen = walk(createDog(14 * 16, 17.5 * 16), { x: 1, y: 0 }, 2)
    expect(toKitchen.x).toBeGreaterThan(17 * 16) // past the partition, inside the kitchen
  })
})

describe('directionFromKeys', () => {
  it('maps arrows and WASD', () => {
    expect(directionFromKeys(new Set(['ArrowLeft']))).toEqual({ x: -1, y: 0 })
    expect(directionFromKeys(new Set(['KeyS']))).toEqual({ x: 0, y: 1 })
  })

  it('cancels opposite keys', () => {
    expect(directionFromKeys(new Set(['ArrowLeft', 'KeyD']))).toEqual({ x: 0, y: 0 })
  })

  it('keeps diagonal speed equal to straight speed', () => {
    const d = directionFromKeys(new Set(['ArrowUp', 'ArrowRight']))
    expect(Math.hypot(d.x, d.y)).toBeCloseTo(1)
  })
})
