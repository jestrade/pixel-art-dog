import { describe, expect, it } from 'vitest'
import { fitView, houseView, roomContaining, roomView, stepView } from './camera'
import { house } from './house'
import { seededRng } from './random'
import { createSession } from './session'

const room = (id: string) => house.rooms.find((r) => r.id === id)!

describe('roomContaining', () => {
  it('finds the room whose floor holds the point', () => {
    expect(roomContaining(house, 100, 300)?.id).toBe('living')
    expect(roomContaining(house, 100, 100)?.id).toBe('master')
    expect(roomContaining(house, 400, 650)?.id).toBe('garden')
    expect(roomContaining(house, 450, 470)?.id).toBe('patio')
  })

  it('returns null in a doorway, on a back wall and beyond the house', () => {
    expect(roomContaining(house, 30, 170)).toBeNull() // bedroom <-> living doorway
    expect(roomContaining(house, 100, 150)).toBeNull() // living room back wall
    expect(roomContaining(house, 700, 100)).toBeNull() // beyond the house
  })
})

describe('stepView', () => {
  const from = { x: 0, y: 0, w: 100, h: 100 }
  const to = { x: 50, y: 20, w: 40, h: 30 }

  it('moves toward the target without overshooting and ends up there', () => {
    let view = from
    let lastGap = Infinity
    for (let i = 0; i < 600; i++) {
      view = stepView(view, to, 1 / 60)
      const gap = Math.abs(view.x - to.x)
      expect(gap).toBeLessThanOrEqual(lastGap)
      lastGap = gap
    }
    expect(view.x).toBeCloseTo(to.x, 2)
    expect(view.w).toBeCloseTo(to.w, 2)
  })

  it('does not depend on the frame rate', () => {
    const once = stepView(from, to, 1 / 30)
    const twice = stepView(stepView(from, to, 1 / 60), to, 1 / 60)
    expect(once.x).toBeCloseTo(twice.x, 6)
    expect(once.w).toBeCloseTo(twice.w, 6)
  })
})

describe('fitView', () => {
  it('matches the screen shape and still contains the view', () => {
    const view = { x: 10, y: 10, w: 100, h: 50 }
    for (const aspect of [0.5, 1, 2, 3]) {
      const fitted = fitView(view, aspect)
      expect(fitted.w / fitted.h).toBeCloseTo(aspect, 6)
      expect(fitted.x).toBeLessThanOrEqual(view.x)
      expect(fitted.y).toBeLessThanOrEqual(view.y)
      expect(fitted.x + fitted.w).toBeGreaterThanOrEqual(view.x + view.w)
      expect(fitted.y + fitted.h).toBeGreaterThanOrEqual(view.y + view.h)
    }
  })
})

describe('session camera', () => {
  const settle = (s: ReturnType<typeof createSession>, seconds: number) => {
    for (let i = 0; i < seconds * 60; i++) s.update(1 / 60)
  }

  it('starts on the whole house', () => {
    expect(createSession(house, seededRng(1)).getView()).toEqual(houseView(house))
  })

  it('zooms to the room the player dog is in, and back out', () => {
    const session = createSession(house, seededRng(1))
    session.setZoom(true)
    settle(session, 3)
    const target = roomView(room('living'))
    expect(session.getView().x).toBeCloseTo(target.x, 1)
    expect(session.getView().w).toBeCloseTo(target.w, 1)

    session.setZoom(false)
    settle(session, 3)
    expect(session.getView().w).toBeCloseTo(house.width, 1)
  })

  it('glides to the next room when the dog walks through a doorway', () => {
    const session = createSession(house, seededRng(1))
    session.setZoom(true)
    settle(session, 3)
    session.keyDown('ArrowUp', false) // from the living room up through the bedroom doorway
    settle(session, 0.1)
    const mid = session.getView()
    expect(mid).toEqual(expect.objectContaining({ x: expect.any(Number) }))
    settle(session, 3)
    session.keyUp('ArrowUp')
    expect(session.getDog().y).toBeLessThan(room('master').bounds.y + room('master').bounds.h)
    settle(session, 3)
    expect(session.getView().x).toBeCloseTo(roomView(room('master')).x, 1)
    expect(session.getView().y).toBeCloseTo(roomView(room('master')).y, 1)
  })

  it('stays on the old room while the dog is in a doorway', () => {
    const session = createSession(house, seededRng(1))
    session.setZoom(true)
    session.keyDown('ArrowUp', false)
    let sawDoorway = false
    for (let i = 0; i < 60 * 3; i++) {
      session.update(1 / 60)
      const dog = session.getDog()
      if (roomContaining(house, dog.x + 6, dog.y + 4) === null) sawDoorway = true
    }
    expect(sawDoorway).toBe(true) // the dog did cross a doorway on the way, and nothing broke
  })
})
