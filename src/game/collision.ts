import type { House, Rect, Room } from './types'

/** The walkable part of a room: everything below the back wall. */
export function roomFloor(room: Room): Rect {
  return {
    x: room.bounds.x,
    y: room.bounds.y + room.wallHeight,
    w: room.bounds.w,
    h: room.bounds.h - room.wallHeight,
  }
}

export function walkableAreas(house: House): Rect[] {
  return [...house.rooms.map(roomFloor), ...house.doorways]
}

export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

function contains(area: Rect, px: number, py: number): boolean {
  return px >= area.x && px < area.x + area.w && py >= area.y && py < area.y + area.h
}

/**
 * True when `body` sits entirely on walkable ground and touches no solid furniture or other bodies in `blockers`.
 * Ground is checked at the corners, edge midpoints and center, so it assumes bodies
 * are smaller than the narrowest wall (one tile).
 */
export function canOccupy(house: House, body: Rect, blockers: readonly Rect[] = []): boolean {
  const areas = walkableAreas(house)
  const xs = [body.x, body.x + Math.floor((body.w - 1) / 2), body.x + body.w - 1]
  const ys = [body.y, body.y + Math.floor((body.h - 1) / 2), body.y + body.h - 1]

  for (const px of xs) {
    for (const py of ys) {
      if (!areas.some((area) => contains(area, px, py))) return false
    }
  }

  if (house.furniture.some((item) => item.footprint !== null && overlaps(item.footprint, body))) return false
  return !blockers.some((other) => overlaps(other, body))
}
