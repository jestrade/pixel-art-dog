import { fitView } from '../game/camera'
import { roomFloor } from '../game/collision'
import type { House, Rect } from '../game/types'
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
 * once into an offscreen canvas. Each frame the whole world is drawn at its own resolution into a
 * second offscreen canvas (furniture and actors back to front, so the dog passes behind and in
 * front of furniture), and then the part inside the camera `view` is scaled onto the visible
 * canvas without smoothing, so pixels stay sharp at any zoom.
 */
export function createHouseRenderer(house: House): (c: Ctx, actors: Actor[], view: Rect) => void {
  const backdrop = document.createElement('canvas')
  backdrop.width = house.width
  backdrop.height = house.height
  paintBackdrop(backdrop.getContext('2d')!, house)

  const world = document.createElement('canvas')
  world.width = house.width
  world.height = house.height
  const w = world.getContext('2d')!

  const objects: Actor[] = house.furniture
    .filter((f) => f.layer === 'object')
    .map((f) => ({
      baseline: (f.footprint ?? f.sprite).y + (f.footprint ?? f.sprite).h,
      draw: (c) => sprites[f.kind](c, f.sprite, f.sprite.x + f.sprite.y),
    }))

  return (c, actors, view) => {
    w.imageSmoothingEnabled = false
    w.drawImage(backdrop, 0, 0)
    const ordered = [...objects, ...actors].sort((a, b) => a.baseline - b.baseline)
    for (const item of ordered) item.draw(w)

    const screenW = c.canvas.width
    const screenH = c.canvas.height
    c.imageSmoothingEnabled = false
    px(c, C.outside, 0, 0, screenW, screenH)

    // Widen the view to the screen's shape so the picture fills it without stretching.
    const shown = fitView(view, screenW / screenH)
    const scale = screenW / shown.w
    const left = Math.max(0, shown.x)
    const top = Math.max(0, shown.y)
    const right = Math.min(house.width, shown.x + shown.w)
    const bottom = Math.min(house.height, shown.y + shown.h)
    if (right <= left || bottom <= top) return
    c.drawImage(
      world,
      left,
      top,
      right - left,
      bottom - top,
      Math.round((left - shown.x) * scale),
      Math.round((top - shown.y) * scale),
      Math.round((right - left) * scale),
      Math.round((bottom - top) * scale),
    )
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
