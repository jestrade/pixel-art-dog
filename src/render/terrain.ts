import type { FloorStyle, Rect, Room } from '../game/types'
import { type Ctx, clipped, px } from './draw'
import { hash } from './noise'
import { C } from './palette'

/** Floors are painted from world coordinates, so neighbouring areas and doorways line up. */
export function drawFloor(c: Ctx, style: FloorStyle, area: Rect): void {
  clipped(c, area, () => {
    if (style === 'wood') drawWood(c, area)
    else if (style === 'tile') drawTile(c, area)
    else drawCarpet(c, area)
  })
}

function drawWood(c: Ctx, area: Rect): void {
  const plankW = 8
  const firstPlank = Math.floor(area.x / plankW)
  const lastPlank = Math.ceil((area.x + area.w) / plankW)

  for (let plank = firstPlank; plank < lastPlank; plank++) {
    const x = plank * plankW
    let y = area.y - Math.floor(hash(plank, 7) * 40)
    let segment = 0
    while (y < area.y + area.h) {
      const length = 24 + Math.floor(hash(plank, segment) * 32)
      px(c, hash(plank, segment + 100) > 0.5 ? C.woodA : C.woodB, x, y, plankW, length)
      px(c, C.woodSeam, x, y + length - 1, plankW, 1) // butt joint
      y += length
      segment++
    }
    px(c, C.woodSeam, x, area.y, 1, area.h) // gap between planks
  }
}

function drawTile(c: Ctx, area: Rect): void {
  const size = 8
  for (let y = Math.floor(area.y / size) * size; y < area.y + area.h; y += size) {
    for (let x = Math.floor(area.x / size) * size; x < area.x + area.w; x += size) {
      px(c, ((x + y) / size) % 2 === 0 ? C.tileA : C.tileB, x, y, size, size)
      px(c, C.tileGrout, x, y, size, 1)
      px(c, C.tileGrout, x, y, 1, size)
    }
  }
}

function drawCarpet(c: Ctx, area: Rect): void {
  px(c, C.carpetA, area.x, area.y, area.w, area.h)
  for (let y = area.y; y < area.y + area.h; y += 2) {
    for (let x = area.x; x < area.x + area.w; x += 2) {
      if (hash(x, y) > 0.72) px(c, C.carpetB, x, y, 2, 1)
    }
  }
}

/** Back wall of a room: painted upper part, wood wainscot, baseboard. */
export function drawWall(c: Ctx, room: Room): void {
  const { x, y, w } = room.bounds
  const h = room.wallHeight
  const paint = room.wallStyle === 'green' ? C.wallGreen : C.wallBlue
  const paintDark = room.wallStyle === 'green' ? C.wallGreenDark : C.wallBlueDark
  const wainscotH = 14

  px(c, paint, x, y, w, h)
  for (let py = y; py < y + h - wainscotH; py += 2) {
    for (let pxl = x; pxl < x + w; pxl += 2) {
      if (hash(pxl, py) > 0.8) px(c, paintDark, pxl, py, 2, 1)
    }
  }

  const wy = y + h - wainscotH
  px(c, C.wainscot, x, wy, w, wainscotH)
  px(c, C.wainscotLight, x, wy, w, 2) // rail
  px(c, C.wainscotDark, x, wy + 2, w, 1)
  for (let panel = x + 12; panel < x + w; panel += 24) {
    px(c, C.wainscotDark, panel, wy + 5, 1, wainscotH - 7)
  }
  px(c, C.baseboard, x, y + h - 2, w, 2)
}

/** Brown wall edge around a room, with a light cap on top. */
export function drawOutline(c: Ctx, b: Rect): void {
  const t = 2
  px(c, C.outline, b.x, b.y, b.w, t)
  px(c, C.outline, b.x, b.y + b.h - t, b.w, t)
  px(c, C.outline, b.x, b.y, t, b.h)
  px(c, C.outline, b.x + b.w - t, b.y, t, b.h)
  px(c, C.outlineLight, b.x + t, b.y + t, b.w - 2 * t, 1)
}

/** Solid partition between rooms. */
export function drawPartition(c: Ctx, wall: Rect): void {
  px(c, C.outline, wall.x, wall.y, wall.w, wall.h)
  px(c, C.outlineLight, wall.x + 2, wall.y, 1, wall.h)
}

/** Opening between rooms: floor painted over the wall, with a door frame on the open sides. */
export function drawDoorway(c: Ctx, door: Rect): void {
  const horizontal = door.w > door.h
  const cut: Rect = horizontal
    ? { x: door.x, y: door.y - 2, w: door.w, h: door.h + 2 }
    : { x: door.x - 2, y: door.y, w: door.w + 4, h: door.h }

  drawFloor(c, 'wood', cut)
  if (horizontal) {
    px(c, C.outline, door.x, door.y - 2, 2, door.h + 2)
    px(c, C.outline, door.x + door.w - 2, door.y - 2, 2, door.h + 2)
  } else {
    px(c, C.outline, cut.x, door.y, cut.w, 2)
  }
}
