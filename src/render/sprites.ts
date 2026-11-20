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
}
