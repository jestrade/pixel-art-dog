import type { FloorStyle, Rect, Room, WallStyle } from '../game/types'
import { type Ctx, clipped, px } from './draw'
import { hash } from './noise'
import { C } from './palette'

/** Floors are painted from world coordinates, so neighbouring areas and doorways line up. */
export function drawFloor(c: Ctx, style: FloorStyle, area: Rect): void {
  clipped(c, area, () => {
    if (style === 'wood') drawWood(c, area)
    else if (style === 'tile') drawTile(c, area, C.tileA, C.tileB, C.tileGrout)
    else if (style === 'bathTile') drawTile(c, area, C.bathTileA, C.bathTileB, C.bathTileGrout)
    else if (style === 'stone') drawPavers(c, area)
    else if (style === 'grass') drawGrass(c, area)
    else drawCarpet(c, area)
  })
}

/** Wall styles that are plain paint over a wainscot. Brick and fence walls are drawn separately. */
const WALL_PAINT: Record<Exclude<WallStyle, 'brick' | 'fence'>, [paint: string, dark: string]> = {
  green: [C.wallGreen, C.wallGreenDark],
  blue: [C.wallBlue, C.wallBlueDark],
  cream: [C.wallCream, C.wallCreamDark],
  teal: [C.wallTeal, C.wallTealDark],
  rose: [C.wallRose, C.wallRoseDark],
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

function drawTile(c: Ctx, area: Rect, colorA: string, colorB: string, grout: string): void {
  const size = 8
  for (let y = Math.floor(area.y / size) * size; y < area.y + area.h; y += size) {
    for (let x = Math.floor(area.x / size) * size; x < area.x + area.w; x += size) {
      px(c, ((x + y) / size) % 2 === 0 ? colorA : colorB, x, y, size, size)
      px(c, grout, x, y, size, 1)
      px(c, grout, x, y, 1, size)
    }
  }
}

/** Patio paving: rows of stone slabs, every other row shifted by half a slab. */
function drawPavers(c: Ctx, area: Rect): void {
  const slabW = 16
  const slabH = 8
  for (let y = Math.floor(area.y / slabH) * slabH; y < area.y + area.h; y += slabH) {
    const shift = (y / slabH) % 2 === 0 ? 0 : slabW / 2
    for (let x = Math.floor((area.x - shift) / slabW) * slabW + shift; x < area.x + area.w; x += slabW) {
      px(c, hash(x, y) > 0.5 ? C.stoneA : C.stoneB, x, y, slabW, slabH)
      px(c, C.stoneJoint, x, y, slabW, 1)
      px(c, C.stoneJoint, x, y, 1, slabH)
    }
  }
}

function drawGrass(c: Ctx, area: Rect): void {
  px(c, C.grassA, area.x, area.y, area.w, area.h)
  for (let y = area.y; y < area.y + area.h; y += 2) {
    for (let x = area.x; x < area.x + area.w; x += 2) {
      const n = hash(x, y)
      if (n > 0.88) px(c, C.grassDark, x, y, 1, 2)
      else if (n < 0.06) px(c, C.grassLight, x, y, 2, 1)
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
  if (room.wallStyle === 'brick') return drawBrickWall(c, room)
  if (room.wallStyle === 'fence') return drawFenceWall(c, room)

  const { x, y, w } = room.bounds
  const h = room.wallHeight
  const [paint, paintDark] = WALL_PAINT[room.wallStyle]
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

/** The house's outside wall, seen from the patio: brick on a stone foundation. */
function drawBrickWall(c: Ctx, room: Room): void {
  const { x, y, w } = room.bounds
  const h = room.wallHeight
  const foundationH = 10
  const brickH = 6
  const brickW = 14

  px(c, C.mortar, x, y, w, h)
  for (let row = 0; row * brickH < h - foundationH; row++) {
    const top = y + row * brickH
    const shift = row % 2 === 0 ? 0 : brickW / 2
    for (let bx = x - shift; bx < x + w; bx += brickW) {
      px(c, hash(bx, row) > 0.5 ? C.brick : C.brickDark, bx + 1, top + 1, brickW - 1, brickH - 1)
    }
  }
  px(c, C.foundation, x, y + h - foundationH, w, foundationH)
  px(c, C.stoneJoint, x, y + h - foundationH, w, 1)
  px(c, C.baseboard, x, y + h - 2, w, 2)
}

/** The garden's back fence: upright planks with two rails. */
function drawFenceWall(c: Ctx, room: Room): void {
  const { x, y, w } = room.bounds
  const h = room.wallHeight
  const plankW = 8

  for (let i = 0; i * plankW < w; i++) {
    const px0 = x + i * plankW
    px(c, i % 2 === 0 ? C.fenceA : C.fenceB, px0, y, plankW, h)
    px(c, C.woodSeam, px0, y, 1, h)
    px(c, C.fenceCap, px0 + 1, y, plankW - 1, 2)
  }
  px(c, C.woodSeam, x, y + 14, w, 2) // rails
  px(c, C.woodSeam, x, y + h - 18, w, 2)
  px(c, C.grassDark, x, y + h - 3, w, 3)
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
