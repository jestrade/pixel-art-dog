import { roomFloor } from '../game/collision'
import type { House } from '../game/types'
import { type Ctx, px } from './draw'
import { C } from './palette'
import { sprites } from './sprites'
import { drawDoorway, drawFloor, drawOutline, drawPartition, drawWall } from './terrain'

/** Something drawn among the furniture and sorted with it by how far down the screen it stands. */
export interface Actor {
  /** World y of the point where it touches the floor. */
  baseline: number
  draw: (c: Ctx) => void
}

/**
 * Build a renderer for a house. The static parts (floors, walls, rugs, wall decor) are painted
 * once into an offscreen canvas; each frame copies that and draws furniture and actors on top,
 * back to front, so the dog passes behind and in front of furniture correctly.
 */
export function createHouseRenderer(house: House): (c: Ctx, actors: Actor[]) => void {
  const backdrop = document.createElement('canvas')
  backdrop.width = house.width
  backdrop.height = house.height
  paintBackdrop(backdrop.getContext('2d')!, house)

  const objects: Actor[] = house.furniture
    .filter((f) => f.layer === 'object')
    .map((f) => ({
      baseline: (f.footprint ?? f.sprite).y + (f.footprint ?? f.sprite).h,
      draw: (c) => sprites[f.kind](c, f.sprite, f.sprite.x + f.sprite.y),
    }))

  return (c, actors) => {
    c.imageSmoothingEnabled = false
    c.drawImage(backdrop, 0, 0)
    const ordered = [...objects, ...actors].sort((a, b) => a.baseline - b.baseline)
    for (const item of ordered) item.draw(c)
  }
}

function paintBackdrop(c: Ctx, house: House): void {
  px(c, C.outside, 0, 0, house.width, house.height)

  for (const room of house.rooms) {
    drawFloor(c, room.floorStyle, roomFloor(room))
    drawWall(c, room)
  }
  house.walls.forEach((wall) => drawPartition(c, wall))
  house.rooms.forEach((room) => drawOutline(c, room.bounds))
  house.doorways.forEach((door) => drawDoorway(c, door))

  for (const layer of ['floor', 'wall'] as const) {
    for (const item of house.furniture.filter((f) => f.layer === layer)) {
      sprites[item.kind](c, item.sprite, item.sprite.x + item.sprite.y)
    }
  }
}
