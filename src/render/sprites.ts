import type { FurnitureKind, Rect } from '../game/types'
import { type Ctx, ellipse, px } from './draw'
import { hash } from './noise'
import { BOOK_COLORS, S } from './palette'

/** Draws one kind of furniture into its sprite rectangle. `seed` varies repeated items. */
export type Sprite = (c: Ctx, area: Rect, seed: number) => void

const sofa: Sprite = (c, { x, y, w, h }) => {
  const back = Math.round(h * 0.55)
  px(c, S.shadow, x + 2, y + h - 3, w - 4, 3)
  px(c, S.sofaDark, x, y, w, back)
  px(c, S.sofaMid, x + 2, y + 2, w - 4, back - 4)
  for (let i = 1; i < 3; i++) px(c, S.sofaDark, x + Math.round((w * i) / 3) - 1, y + 2, 2, back - 4)
  px(c, S.sofaSeat, x + 8, y + back - 2, w - 16, h - back - 2)
  px(c, S.sofaSeatLight, x + 8, y + back - 2, w - 16, 2)
  for (const ax of [x, x + w - 9]) {
    px(c, S.sofaDark, ax, y + 6, 9, h - 6)
    px(c, S.sofaMid, ax + 1, y + 8, 7, h - 12)
  }
  px(c, S.woodDeep, x + 3, y + h - 2, 3, 2)
  px(c, S.woodDeep, x + w - 6, y + h - 2, 3, 2)
  const pillowX = x + w - 30
  const pillowY = y + back - 12
  px(c, S.pillow, pillowX, pillowY, 16, 14)
  px(c, S.pillowLight, pillowX + 2, pillowY + 2, 12, 2)
  px(c, S.pillowDark, pillowX, pillowY + 12, 16, 2)
}

const bookshelf: Sprite = (c, { x, y, w, h }, seed) => {
  px(c, S.woodDark, x, y, w, h)
  px(c, S.woodDeep, x + 3, y + 3, w - 6, h - 9)
  px(c, S.wood, x + 1, y + h - 6, w - 2, 6)
  const rows = 4
  const rowH = Math.floor((h - 12) / rows)
  for (let row = 0; row < rows; row++) {
    const top = y + 3 + row * rowH
    let bx = x + 4
    while (bx < x + w - 6) {
      const bw = 2 + Math.floor(hash(bx, row + seed) * 3)
      const bh = rowH - 5 - Math.floor(hash(bx + 1, row + seed) * 4)
      px(c, BOOK_COLORS[Math.floor(hash(bx, row * 9 + seed) * BOOK_COLORS.length)], bx, top + rowH - 2 - bh, bw, bh)
      bx += bw + (hash(bx, 3) > 0.7 ? 1 : 0)
    }
    px(c, S.wood, x + 3, top + rowH - 2, w - 6, 2)
  }
}

const sideTable: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x + 2, y + h - 2, w - 4, 2)
  px(c, S.woodDark, x + 4, y + 10, 2, h - 12)
  px(c, S.woodDark, x + w - 6, y + 10, 2, h - 12)
  ellipse(c, S.woodDark, x, y + 8, w, 6)
  ellipse(c, S.woodLight, x, y + 7, w, 5)
  px(c, S.white, x + 8, y + 3, 7, 5) // cup
  px(c, S.whiteShade, x + 8, y + 7, 7, 1)
  px(c, S.leaf, x + 10, y, 3, 3) // sprig
}

const floorLamp: Sprite = (c, { x, y, w, h }) => {
  const cx = x + Math.floor(w / 2)
  ellipse(c, S.lampBase, x + 1, y + h - 6, w - 2, 6)
  px(c, S.lampPole, cx - 1, y + 14, 2, h - 18)
  px(c, S.shade, x, y + 2, w, 12)
  px(c, S.shadeLight, x + 2, y + 4, w - 4, 8)
  px(c, S.glow, cx - 3, y + 6, 6, 4)
  px(c, S.shade, x + 3, y, w - 6, 2)
}

const coffeeTable: Sprite = (c, { x, y, w, h }) => {
  const topH = Math.round(h * 0.7)
  px(c, S.shadow, x + 2, y + h - 2, w - 4, 2)
  px(c, S.woodDark, x + 2, y + topH, 3, h - topH)
  px(c, S.woodDark, x + w - 5, y + topH, 3, h - topH)
  px(c, S.woodDark, x, y, w, topH)
  px(c, S.woodLight, x + 1, y + 1, w - 2, topH - 4)
  px(c, S.wood, x + 1, y + topH - 3, w - 2, 2)
  px(c, S.white, x + 8, y + 5, 7, 9) // jars
  px(c, S.whiteShade, x + 8, y + 12, 7, 2)
  px(c, S.white, x + 17, y + 7, 7, 8)
  px(c, S.whiteShade, x + 17, y + 13, 7, 2)
  px(c, S.pillowDark, x + 36, y + 6, 14, 10) // book
  px(c, S.pillow, x + 37, y + 7, 12, 8)
}

const tvStand: Sprite = (c, { x, y, w, h }) => {
  const screenH = Math.round(h * 0.6)
  px(c, S.bezel, x + 4, y, w - 8, screenH)
  px(c, S.screen, x + 6, y + 2, w - 12, screenH - 4)
  px(c, S.screenLight, x + 8, y + 4, 14, 2)
  px(c, S.screenLight, x + 8, y + 6, 8, 2)
  px(c, S.bezel, x + Math.floor(w / 2) - 5, y + screenH, 10, 3)
  const cabY = y + screenH + 3
  px(c, S.woodDark, x, cabY, w, h - screenH - 3)
  px(c, S.wood, x + 2, cabY + 2, w - 4, h - screenH - 7)
  px(c, S.woodDeep, x + Math.floor(w / 2), cabY + 2, 1, h - screenH - 7)
}

const plant: Sprite = (c, { x, y, w, h }) => {
  const potH = Math.round(h * 0.38)
  const potW = Math.round(w * 0.5)
  const cx = x + Math.floor(w / 2)
  const potY = y + h - potH
  const leaves: Array<[number, number]> = [
    [-1, -0.5],
    [-0.65, -0.85],
    [0, -1],
    [0.65, -0.85],
    [1, -0.5],
    [-0.9, -0.15],
    [0.9, -0.15],
  ]
  for (const [i, [dx, dy]] of leaves.entries()) {
    const tipX = cx + Math.round(dx * w * 0.48)
    const tipY = potY + Math.round(dy * (h - potH))
    const steps = 18
    for (let s = 0; s <= steps; s++) {
      const fx = cx + ((tipX - cx) * s) / steps
      const fy = potY + ((tipY - potY) * s) / steps
      const thick = s < steps * 0.65 ? 3 : 2
      px(c, i % 2 === 0 ? S.leaf : S.leafLight, fx - 1, fy - 1, thick, thick)
      if (s % 3 === 0) px(c, S.leafDark, fx, fy + 1, 1, 1)
    }
  }
  px(c, S.dirt, cx - potW / 2 + 2, potY, potW - 4, 2)
  for (let i = 2; i < potH; i++) {
    const inset = Math.floor((potH - i) * 0.12)
    px(c, S.white, cx - potW / 2 + inset, potY + i, potW - inset * 2, 1)
    px(c, S.whiteShade, cx + potW / 2 - inset - 4, potY + i, 4, 1)
  }
}

const rug: Sprite = (c, { x, y, w, h }) => {
  px(c, S.creamBorder, x, y + 3, w, h - 6)
  px(c, S.cream, x + 2, y + 5, w - 4, h - 10)
  for (let sx = x + 4; sx < x + w - 4; sx += 4) px(c, S.creamDark, sx, y + 5, 1, h - 10)
  for (let sx = x; sx < x + w; sx += 2) {
    px(c, S.creamBorder, sx, y, 1, 3) // fringe
    px(c, S.creamBorder, sx, y + h - 3, 1, 3)
  }
}

const doormat: Sprite = (c, { x, y, w, h }) => {
  px(c, S.cream, x, y, w, h)
  for (let row = 2; row < h - 2; row += 6) {
    for (let sx = 0; sx < w; sx++) {
      const wave = sx % 8 < 4 ? sx % 4 : 3 - (sx % 4)
      px(c, S.creamBorder, x + sx, y + row + wave, 1, 2)
    }
  }
  px(c, S.creamBorder, x, y, w, 1)
  px(c, S.creamBorder, x, y + h - 1, w, 1)
}

const dogBed: Sprite = (c, { x, y, w, h }) => {
  ellipse(c, S.dogBedRim, x, y, w, h)
  ellipse(c, S.dogBedInner, x + 4, y + 4, w - 8, h - 8)
  ellipse(c, S.dogBedDark, x + 8, y + 8, w - 16, h - 14)
}

const frame: Sprite = (c, { x, y, w, h }, seed) => {
  px(c, S.frameWhite, x, y, w, h)
  px(c, S.paper, x + 2, y + 2, w - 4, h - 4)
  const art = Math.floor(hash(seed) * 3)
  const ax = x + 3
  const ay = y + 3
  const aw = w - 6
  const ah = h - 6
  if (art === 0) {
    for (let i = 0; i < ah; i++) px(c, S.tan, x + w / 2 - i / 2, ay + i, i + 1, 1) // triangle
    px(c, S.orange, ax, ay + ah - 2, aw, 2)
  } else if (art === 1) {
    ellipse(c, S.teal, ax, ay, aw, Math.min(aw, ah))
    px(c, S.grey, ax, ay + ah - 3, aw, 3)
  } else {
    px(c, S.grey, ax, ay, aw, ah)
    px(c, S.orange, ax + 2, ay + 2, aw - 4, Math.floor(ah / 2))
  }
}

const windowSprite: Sprite = (c, { x, y, w, h }) => {
  px(c, S.windowFrame, x, y, w, h)
  px(c, S.sky, x + 3, y + 3, w - 6, h - 8)
  px(c, S.skyLight, x + 3, y + 3, w - 6, 6)
  px(c, S.windowFrame, x + Math.floor(w / 2) - 1, y + 3, 2, h - 8)
  px(c, S.windowFrame, x + 3, y + Math.floor(h / 2) - 2, w - 6, 2)
  px(c, S.woodLight, x - 2, y + h - 3, w + 4, 3) // sill
}

const coatHook: Sprite = (c, { x, y, w, h }) => {
  const cx = x + Math.floor(w / 2)
  px(c, S.woodDark, x + 1, y, w - 2, 2)
  px(c, S.woodDeep, cx - 1, y + 2, 2, 3)
  px(c, S.raincoat, cx - 5, y + 6, 10, h - 8) // coat body
  px(c, S.raincoat, cx - 4, y + 3, 8, 4) // hood
  px(c, S.raincoatDark, cx - 4, y + 5, 8, 1)
  px(c, S.raincoatDark, cx + 2, y + 8, 3, h - 10)
  px(c, S.raincoatDark, cx - 5, y + h - 3, 10, 2)
}

const boots: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x, y + h - 2, w, 2)
  for (const bx of [x + 1, x + 13]) {
    px(c, S.boot, bx, y + 2, 7, h - 6) // shaft
    px(c, S.boot, bx - 3, y + h - 8, 11, 6) // foot
    px(c, S.bootDark, bx - 3, y + h - 3, 11, 2) // sole
    px(c, S.bootDark, bx, y + 2, 7, 1)
  }
}

const bed: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x + 2, y + h - 3, w - 4, 3)
  px(c, S.woodDark, x, y, w, h - 2)
  px(c, S.woodDeep, x, y, w, 10) // headboard
  px(c, S.wood, x + 2, y + 2, w - 4, 6)
  px(c, S.white, x + 6, y + 10, 28, 14) // pillows
  px(c, S.white, x + w - 34, y + 10, 28, 14)
  px(c, S.whiteShade, x + 6, y + 21, 28, 3)
  px(c, S.whiteShade, x + w - 34, y + 21, 28, 3)
  px(c, S.blanket, x + 3, y + 26, w - 6, h - 31)
  px(c, S.blanketLight, x + 3, y + 26, w - 6, 5) // folded edge
  px(c, S.blanketDark, x + 3, y + 31, w - 6, 1)
  for (let sx = x + 8; sx < x + w - 6; sx += 10) px(c, S.blanketDark, sx, y + 38, 1, h - 45)
}

const wardrobe: Sprite = (c, { x, y, w, h }) => {
  px(c, S.woodDeep, x, y, w, h)
  px(c, S.wood, x + 2, y + 2, w - 4, h - 6)
  px(c, S.woodLight, x + 2, y + 2, w - 4, 2)
  const half = Math.floor(w / 2)
  px(c, S.woodDark, x + half - 1, y + 3, 2, h - 8)
  px(c, S.woodLight, x + 5, y + 8, half - 9, h - 18)
  px(c, S.woodLight, x + half + 4, y + 8, half - 9, h - 18)
  px(c, S.glow, x + half - 5, y + Math.floor(h / 2), 2, 4) // handles
  px(c, S.glow, x + half + 3, y + Math.floor(h / 2), 2, 4)
  px(c, S.shadow, x, y + h - 2, w, 2)
}

const nightstand: Sprite = (c, { x, y, w, h }) => {
  px(c, S.woodDeep, x, y + 8, w, h - 8)
  px(c, S.wood, x + 2, y + 10, w - 4, h - 14)
  px(c, S.woodDark, x + 2, y + 15, w - 4, 1)
  px(c, S.glow, x + Math.floor(w / 2) - 2, y + 18, 4, 2) // knob
  px(c, S.shade, x + 6, y, w - 12, 8) // little lamp
  px(c, S.shadeLight, x + 8, y + 2, w - 16, 4)
}

const fridge: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x + 2, y + h - 2, w - 4, 2)
  px(c, S.metalDark, x, y, w, h - 2)
  px(c, S.fridge, x + 1, y + 1, w - 2, h - 4)
  px(c, S.fridgeLight, x + 2, y + 2, 3, h - 6)
  const split = y + Math.round(h * 0.36)
  px(c, S.metalDark, x + 1, split, w - 2, 2)
  px(c, S.metalDark, x + w - 7, y + 5, 2, 10)
  px(c, S.metalDark, x + w - 7, split + 6, 2, 14)
}

/** Two-door wooden cabinet front shared by counters, sinks and vanities. */
function cabinetFront(c: Ctx, x: number, y: number, w: number, h: number): void {
  const mid = x + Math.floor(w / 2)
  px(c, S.woodDeep, x, y, w, h)
  px(c, S.wood, x + 1, y + 1, w - 2, h - 2)
  px(c, S.woodDark, mid, y + 1, 1, h - 2)
  px(c, S.glow, mid - 4, y + 3, 2, 3)
  px(c, S.glow, mid + 3, y + 3, 2, 3)
}

function counterBody(c: Ctx, { x, y, w, h }: Rect): number {
  const top = Math.round(h * 0.45)
  px(c, S.shadow, x + 1, y + h - 2, w - 2, 2)
  px(c, S.counterEdge, x, y, w, top)
  px(c, S.counterTop, x, y, w, top - 3)
  cabinetFront(c, x + 1, y + top, w - 2, h - top - 2)
  return top
}

const counter: Sprite = (c, area) => {
  counterBody(c, area)
}

const sink: Sprite = (c, area) => {
  counterBody(c, area)
  const { x, y, w } = area
  px(c, S.metalDark, x + 8, y + 4, w - 16, 11)
  px(c, S.metal, x + 9, y + 5, w - 18, 9)
  px(c, S.metalDark, x + Math.floor(w / 2) - 1, y + 1, 2, 5) // faucet
}

const stove: Sprite = (c, { x, y, w, h }) => {
  const top = Math.round(h * 0.45)
  px(c, S.shadow, x + 1, y + h - 2, w - 2, 2)
  px(c, S.stove, x, y, w, top)
  ellipse(c, S.stoveRing, x + 3, y + 3, 11, 7)
  ellipse(c, S.stoveRing, x + w - 14, y + 3, 11, 7)
  ellipse(c, S.stove, x + 6, y + 5, 5, 3)
  ellipse(c, S.stove, x + w - 11, y + 5, 5, 3)
  px(c, S.metalDark, x, y + top, w, h - top - 2)
  px(c, S.stove, x + 3, y + top + 4, w - 6, h - top - 10) // oven window
  px(c, S.screenLight, x + 5, y + top + 6, 6, 2)
  px(c, S.metal, x + 3, y + top + 1, w - 6, 2) // handle
}

const diningTable: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x + 4, y + h - 2, w - 8, 2)
  px(c, S.woodDeep, x + 3, y + h - 14, 3, 12)
  px(c, S.woodDeep, x + w - 6, y + h - 14, 3, 12)
  px(c, S.woodDark, x, y, w, h - 12)
  px(c, S.woodLight, x + 1, y + 1, w - 2, h - 18)
  px(c, S.wood, x + 1, y + h - 17, w - 2, 4)
  ellipse(c, S.white, x + Math.floor(w / 2) - 7, y + 8, 14, 8) // fruit bowl
  px(c, S.raincoat, x + Math.floor(w / 2) - 3, y + 6, 3, 3)
  px(c, S.dogBedRim, x + Math.floor(w / 2), y + 7, 3, 3)
  px(c, S.white, x + 8, y + 10, 8, 6) // place settings
  px(c, S.white, x + w - 16, y + 10, 8, 6)
}

/** Chair seen from the front: backrest at the top. */
const chair: Sprite = (c, { x, y, w, h }) => {
  px(c, S.woodDark, x + 1, y, w - 2, 6)
  px(c, S.wood, x + 2, y + 1, w - 4, 3)
  px(c, S.cream, x, y + 7, w, h - 11)
  px(c, S.creamDark, x, y + h - 6, w, 2)
  px(c, S.woodDeep, x + 1, y + h - 4, 2, 4)
  px(c, S.woodDeep, x + w - 3, y + h - 4, 2, 4)
}

/** Chair seen from behind: backrest at the bottom, in front of the seat. */
const chairBack: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x, y + h - 2, w, 2)
  px(c, S.cream, x, y, w, h - 10)
  px(c, S.woodDeep, x + 1, y + 1, 2, 3)
  px(c, S.woodDeep, x + w - 3, y + 1, 2, 3)
  px(c, S.woodDark, x + 1, y + h - 11, w - 2, 9)
  px(c, S.wood, x + 2, y + h - 10, w - 4, 4)
}

const bathtub: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x + 2, y + h - 2, w - 4, 2)
  px(c, S.metalDark, x + 4, y + h - 5, 4, 3)
  px(c, S.metalDark, x + w - 8, y + h - 5, 4, 3)
  px(c, S.white, x, y, w, h - 4)
  px(c, S.whiteShade, x, y + h - 8, w, 4)
  px(c, S.whiteShade, x + 4, y + 4, w - 8, h - 14)
  px(c, S.water, x + 5, y + 5, w - 10, h - 16)
  px(c, S.waterLight, x + 8, y + 8, 18, 2)
  px(c, S.metal, x + w - 14, y - 1, 8, 4) // faucet
}

const toilet: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x + 2, y + h - 2, w - 4, 2)
  px(c, S.white, x + 2, y, w - 4, 14)
  px(c, S.whiteShade, x + 2, y + 11, w - 4, 3)
  px(c, S.metal, x + Math.floor(w / 2) - 2, y + 2, 4, 2)
  ellipse(c, S.white, x, y + 14, w, h - 17)
  ellipse(c, S.whiteShade, x + 3, y + 17, w - 6, h - 24)
}

const vanity: Sprite = (c, { x, y, w, h }) => {
  px(c, S.windowFrame, x + 2, y, w - 4, 17)
  px(c, S.sky, x + 4, y + 2, w - 8, 13)
  px(c, S.skyLight, x + 5, y + 3, 5, 2)
  px(c, S.shadow, x + 1, y + h - 2, w - 2, 2)
  px(c, S.white, x, y + 20, w, 10)
  ellipse(c, S.whiteShade, x + 5, y + 22, w - 10, 6)
  px(c, S.metal, x + Math.floor(w / 2) - 1, y + 19, 2, 3)
  cabinetFront(c, x + 1, y + 30, w - 2, h - 32)
}

const desk: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x + 2, y + h - 2, w - 4, 2)
  px(c, S.woodDark, x, y, w, 26)
  px(c, S.woodLight, x + 1, y + 1, w - 2, 22)
  px(c, S.bezel, x + 22, y + 2, 22, 14) // monitor
  px(c, S.screen, x + 24, y + 4, 18, 10)
  px(c, S.screenLight, x + 26, y + 6, 8, 2)
  px(c, S.bezel, x + 31, y + 16, 4, 3)
  px(c, S.whiteShade, x + 22, y + 19, 18, 3) // keyboard
  px(c, S.white, x + w - 10, y + 12, 5, 6) // mug
  px(c, S.woodDeep, x + 1, y + 26, w - 2, h - 28)
  px(c, S.wood, x + 3, y + 28, 18, h - 32)
  px(c, S.wood, x + w - 21, y + 28, 18, h - 32)
  px(c, S.glow, x + 10, y + 31, 2, 3)
  px(c, S.glow, x + w - 12, y + 31, 2, 3)
}

const singleBed: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x + 2, y + h - 3, w - 4, 3)
  px(c, S.woodDark, x, y, w, h - 2)
  px(c, S.woodDeep, x, y, w, 8)
  px(c, S.white, x + 6, y + 9, w - 12, 14)
  px(c, S.whiteShade, x + 6, y + 20, w - 12, 3)
  px(c, S.quilt, x + 3, y + 25, w - 6, h - 30)
  px(c, S.quiltLight, x + 3, y + 25, w - 6, 5)
  px(c, S.quiltDark, x + 3, y + 30, w - 6, 1)
  for (let sx = x + 9; sx < x + w - 6; sx += 10) px(c, S.quiltDark, sx, y + 40, 1, h - 48)
}

const frontDoor: Sprite = (c, { x, y, w, h }) => {
  px(c, S.woodDeep, x, y, w, h)
  px(c, S.doorWood, x + 2, y + 2, w - 4, h - 2)
  px(c, S.doorWoodLight, x + 4, y + 4, w - 8, 3)
  px(c, S.sky, x + 8, y + 9, w - 16, 14)
  px(c, S.skyLight, x + 9, y + 10, 4, 3)
  px(c, S.doorWoodLight, x + 5, y + 28, w - 10, h - 34)
  px(c, S.doorWood, x + 7, y + 30, w - 14, h - 38)
  px(c, S.glow, x + w - 9, y + Math.floor(h / 2), 3, 3)
}

const tree: Sprite = (c, { x, y, w, h }, seed) => {
  const cx = x + Math.floor(w / 2)
  const trunkW = Math.max(6, Math.round(w * 0.16))
  const trunkH = Math.round(h * 0.34)
  ellipse(c, S.shadow, x + w * 0.15, y + h - 6, w * 0.7, 6)
  px(c, S.woodDeep, cx - trunkW / 2, y + h - trunkH, trunkW, trunkH - 2)
  px(c, S.wood, cx - trunkW / 2 + 1, y + h - trunkH, trunkW - 3, trunkH - 3)
  const canopyH = h - trunkH + 12
  ellipse(c, S.leafDark, x, y + canopyH * 0.22, w, canopyH * 0.78)
  ellipse(c, S.leaf, x + 3, y + canopyH * 0.12, w - 8, canopyH * 0.7)
  ellipse(c, S.leafLight, x + w * 0.22, y + 1, w * 0.5, canopyH * 0.38)
  for (let i = 0; i < 6; i++) {
    const fx = x + 6 + Math.floor(hash(seed, i) * (w - 14))
    const fy = y + 8 + Math.floor(hash(seed, i + 9) * (canopyH * 0.6))
    px(c, S.dogBedRim, fx, fy, 3, 3) // fruit
  }
}

const bush: Sprite = (c, { x, y, w, h }) => {
  ellipse(c, S.shadow, x + 1, y + h - 4, w - 2, 4)
  ellipse(c, S.leafDark, x, y + 3, w, h - 4)
  ellipse(c, S.leaf, x + 2, y + 1, w - 6, h - 6)
  ellipse(c, S.leafLight, x + 5, y, Math.max(6, w - 16), Math.max(4, h - 14))
}

const flowerBed: Sprite = (c, { x, y, w, h }, seed) => {
  const colors = [S.dogBedRim, S.raincoat, S.flowerPink, S.flowerWhite, S.orange]
  px(c, S.stone, x, y + Math.floor(h / 3), w, h - Math.floor(h / 3))
  px(c, S.soil, x + 2, y + Math.floor(h / 3) + 2, w - 4, h - Math.floor(h / 3) - 4)
  for (let fx = x + 4; fx < x + w - 4; fx += 6) {
    const tall = Math.floor(hash(fx, seed) * 5)
    px(c, S.leafDark, fx + 1, y + 6 - tall, 1, 8 + tall) // stem
    px(c, colors[Math.floor(hash(fx, seed + 3) * colors.length)], fx - 1, y + 3 - tall, 4, 4) // bloom
    px(c, S.raincoatDark, fx, y + 4 - tall, 2, 2)
  }
}

const gardenBench: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x + 2, y + h - 2, w - 4, 2)
  px(c, S.woodDark, x + 3, y + 10, 3, h - 12) // legs
  px(c, S.woodDark, x + w - 6, y + 10, 3, h - 12)
  px(c, S.woodLight, x, y, w, 4) // backrest
  px(c, S.wood, x, y + 5, w, 3)
  px(c, S.woodLight, x, y + 10, w, 5) // seat
  px(c, S.woodDark, x, y + 15, w, 1)
}

const doghouse: Sprite = (c, { x, y, w, h }) => {
  const cx = x + Math.floor(w / 2)
  px(c, S.shadow, x + 2, y + h - 2, w - 4, 2)
  px(c, S.wood, x + 3, y + 16, w - 6, h - 18)
  for (let px0 = x + 7; px0 < x + w - 4; px0 += 6) px(c, S.woodDark, px0, y + 16, 1, h - 18)
  for (let r = 0; r < 17; r++) {
    const half = Math.round(((w / 2 + 2) * (r + 1)) / 17)
    px(c, r > 14 ? S.woodDeep : S.dogBedRim, cx - half, y + r, half * 2, 1) // roof
  }
  px(c, S.woodDeep, x + 14, y + 26, w - 28, h - 28)
  ellipse(c, S.woodDeep, x + 14, y + 22, w - 28, 10)
  px(c, S.dogBedInner, x + 18, y + h - 5, w - 36, 2) // bowl
}

const patioSet: Sprite = (c, { x, y, w, h }) => {
  const cx = x + Math.floor(w / 2)
  ellipse(c, S.shadow, x + 6, y + h - 6, w - 12, 6)
  px(c, S.metalDark, cx - 1, y + 18, 2, 30) // umbrella pole
  ellipse(c, S.orange, x, y, w, 26) // canopy
  for (let sx = x + 6; sx < x + w - 4; sx += 12) px(c, S.white, sx, y + 4, 5, 18) // stripes
  ellipse(c, S.doorWoodLight, x + 2, y + 17, w - 4, 8) // canopy rim
  ellipse(c, S.woodDark, x + 8, y + 44, w - 16, 14) // table
  ellipse(c, S.woodLight, x + 8, y + 42, w - 16, 12)
  px(c, S.woodDark, x + 10, y + 53, 3, h - 58)
  px(c, S.woodDark, x + w - 13, y + 53, 3, h - 58)
  px(c, S.white, cx - 6, y + 44, 5, 4) // cups
  px(c, S.pillow, cx + 2, y + 45, 5, 4)
}

const grill: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x + 2, y + h - 2, w - 4, 2)
  px(c, S.metalDark, x + 4, y + 22, 2, h - 24) // legs
  px(c, S.metalDark, x + w - 6, y + 22, 2, h - 24)
  ellipse(c, S.stove, x, y, w, 18) // lid
  ellipse(c, S.stoveRing, x + 3, y + 2, w - 12, 6)
  px(c, S.stove, x + 1, y + 13, w - 2, 10)
  px(c, S.metal, x - 2, y + 9, 5, 2) // handle
  px(c, S.dogBedRim, x + w - 8, y + 16, 3, 3) // glowing knob
}

const lounger: Sprite = (c, { x, y, w, h }) => {
  px(c, S.shadow, x + 2, y + h - 2, w - 4, 2)
  px(c, S.metalDark, x, y, w, h - 2)
  px(c, S.cream, x + 2, y + 2, w - 4, h - 6)
  px(c, S.quiltLight, x + 2, y + 2, w - 4, 12) // headrest
  for (let sy = y + 18; sy < y + h - 6; sy += 6) px(c, S.creamDark, x + 2, sy, w - 4, 1)
}

const stonePath: Sprite = (c, { x, y, w, h }, seed) => {
  for (let sy = y; sy < y + h - 6; sy += 9) {
    const row = Math.floor((sy - y) / 9)
    const count = 2 + (row % 2)
    const slot = w / count
    for (let i = 0; i < count; i++) {
      const sw = Math.floor(slot - 5 - hash(seed, row * 5 + i) * 4)
      const sx = x + i * slot + 2 + Math.floor(hash(row, i + seed) * 3)
      px(c, S.stoneDark, sx, sy + 3, sw, 5)
      px(c, S.stone, sx, sy + 1, sw, 5)
    }
  }
}

/** Registry: one drawing function per furniture kind. */
export const sprites: Record<FurnitureKind, Sprite> = {
  sofa,
  bookshelf,
  sideTable,
  floorLamp,
  coffeeTable,
  tvStand,
  plant,
  rug,
  doormat,
  dogBed,
  frame,
  window: windowSprite,
  coatHook,
  boots,
  bed,
  wardrobe,
  nightstand,
  fridge,
  counter,
  sink,
  stove,
  diningTable,
  chair,
  chairBack,
  bathtub,
  toilet,
  vanity,
  desk,
  singleBed,
  frontDoor,
  tree,
  bush,
  flowerBed,
  gardenBench,
  doghouse,
  patioSet,
  grill,
  lounger,
  stonePath,
}
