import { roomFloor } from './collision'
import type { House, Rect, Room } from './types'

/** Extra world pixels shown around a room when zoomed in, so its walls are not cut off. */
export const ROOM_MARGIN = 8

/** How quickly the view catches up with its target, per second. Higher is snappier. */
const FOLLOW_SPEED = 6

/** The area shown when the whole house is in view. */
export function houseView(house: House): Rect {
  return { x: 0, y: 0, w: house.width, h: house.height }
}

/** The area shown when zoomed in on one room. */
export function roomView(room: Room): Rect {
  const { x, y, w, h } = room.bounds
  return { x: x - ROOM_MARGIN, y: y - ROOM_MARGIN, w: w + 2 * ROOM_MARGIN, h: h + 2 * ROOM_MARGIN }
}

/**
 * The room whose floor holds the point, or null in a doorway (which belongs to no room).
 * Callers keep the previous room in that case, so the view does not flicker between rooms.
 */
export function roomContaining(house: House, x: number, y: number): Room | null {
  return (
    house.rooms.find((room) => {
      const floor = roomFloor(room)
      return x >= floor.x && x < floor.x + floor.w && y >= floor.y && y < floor.y + floor.h
    }) ?? null
  )
}

/** Move `current` toward `target`, easing out so the view settles smoothly. Frame-rate independent. */
export function stepView(current: Rect, target: Rect, dt: number): Rect {
  const k = 1 - Math.exp(-FOLLOW_SPEED * dt)
  return {
    x: current.x + (target.x - current.x) * k,
    y: current.y + (target.y - current.y) * k,
    w: current.w + (target.w - current.w) * k,
    h: current.h + (target.h - current.h) * k,
  }
}

/** Grow `view` around its center until it has the given width / height ratio, so it fills the screen undistorted. */
export function fitView(view: Rect, aspect: number): Rect {
  if (view.w / view.h < aspect) {
    const w = view.h * aspect
    return { x: view.x - (w - view.w) / 2, y: view.y, w, h: view.h }
  }
  const h = view.w / aspect
  return { x: view.x, y: view.y - (h - view.h) / 2, w: view.w, h }
}
