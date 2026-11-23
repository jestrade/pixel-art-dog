import { describe, expect, it } from 'vitest'
import { canOccupy, overlaps, roomFloor } from './collision'
import { house } from './house'
import type { Rect } from './types'

const DOG = { w: 12, h: 8 }
const STEP = 4

describe('house layout', () => {
  it('has nine rooms', () => {
    expect(house.rooms.map((r) => r.id)).toEqual([
      'master',
      'bathroom',
      'kids',
      'living',
      'kitchen',
      'office',
      'entry',
      'patio',
      'garden',
    ])
  })

  it('keeps solid furniture from overlapping each other', () => {
    const solids = house.furniture.filter((f) => f.footprint !== null)
    for (let i = 0; i < solids.length; i++) {
      for (let j = i + 1; j < solids.length; j++) {
        const a = solids[i].footprint as Rect
        const b = solids[j].footprint as Rect
        expect(overlaps(a, b), `${solids[i].id} overlaps ${solids[j].id}`).toBe(false)
      }
    }
  })

  it('keeps every sprite inside the house', () => {
    for (const { id, sprite } of house.furniture) {
      expect(sprite.x, id).toBeGreaterThanOrEqual(0)
      expect(sprite.y, id).toBeGreaterThanOrEqual(0)
      expect(sprite.x + sprite.w, id).toBeLessThanOrEqual(house.width)
      expect(sprite.y + sprite.h, id).toBeLessThanOrEqual(house.height)
    }
  })
})

describe('collisions', () => {
  const spawn = { ...house.dogSpawns[0], ...DOG }

  it('allows standing on open floor', () => {
    expect(canOccupy(house, spawn)).toBe(true)
  })

  it('blocks walls, outside space and furniture', () => {
    expect(canOccupy(house, { x: 100, y: 150, ...DOG })).toBe(false) // living room back wall
    expect(canOccupy(house, { x: 500, y: 400, ...DOG })).toBe(false) // outside the house
    const sofa = house.furniture.find((f) => f.id === 'sofa')!.footprint as Rect
    expect(canOccupy(house, { x: sofa.x + 4, y: sofa.y + 4, ...DOG })).toBe(false)
  })

  it('lets the dog reach every room from the living room', () => {
    const seen = new Set<string>()
    const queue = [{ x: spawn.x, y: spawn.y }]
    seen.add(`${spawn.x},${spawn.y}`)

    while (queue.length > 0) {
      const { x, y } = queue.pop()!
      for (const [dx, dy] of [[STEP, 0], [-STEP, 0], [0, STEP], [0, -STEP]]) {
        const next = { x: x + dx, y: y + dy }
        const key = `${next.x},${next.y}`
        if (seen.has(key) || !canOccupy(house, { ...next, ...DOG })) continue
        seen.add(key)
        queue.push(next)
      }
    }

    for (const room of house.rooms) {
      const floor = roomFloor(room)
      const reached = [...seen].some((key) => {
        const [x, y] = key.split(',').map(Number)
        return x >= floor.x && x + DOG.w <= floor.x + floor.w && y >= floor.y && y + DOG.h <= floor.y + floor.h
      })
      expect(reached, `${room.id} is reachable`).toBe(true)
    }
  })
})
