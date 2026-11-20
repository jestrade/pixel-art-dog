import { ACTIONS } from '../game/actions'
import { DOG_BODY, type Dog } from '../game/dog'
import { type Ctx, ellipse, px } from './draw'
import { ACCENT_COLORS, BREED_PALETTES, type DogPalette } from './breedPalettes'
import type { Actor } from './drawHouse'

const D = {
  black: '#1a1a22',
  heart: '#d9433f',
  mouth: '#e0688c',
  white: '#fbf8f0',
  shadow: 'rgba(40, 24, 10, 0.3)',
}

const SPRITE_W = 20
const SPRITE_H = 18
const FRAME_SECONDS = 0.15
const RUN_FRAME_SECONDS = 0.08
const JUMP_HEIGHT = 12

/** What the dog looks like this frame. */
interface Pose {
  /** Walk cycle frame, 0 or 1. */
  step: number
  /** Tail frame, 0 or 1. */
  tail: number
  sitting: boolean
  mouthOpen: boolean
  palette: DogPalette
  /** Hair bow color. */
  accent: string
}

/** Draws a dog in its breed's colors, with a hair bow in its own accent color. */
export function dogActor(dog: Dog): Actor {
  const action = dog.action
  const elapsed = action?.elapsed ?? 0
  const frameSeconds = dog.running ? RUN_FRAME_SECONDS : FRAME_SECONDS
  const step = dog.moving ? Math.floor(dog.walkClock / frameSeconds) % 2 : 0
  const barkOpen = action?.kind === 'bark' && Math.floor(elapsed / 0.12) % 2 === 0

  const pose: Pose = {
    step,
    tail: action?.kind === 'wag' ? Math.floor(elapsed / 0.08) % 2 : step,
    sitting: action?.kind === 'sit',
    mouthOpen: barkOpen,
    palette: BREED_PALETTES[dog.breed],
    accent: ACCENT_COLORS[dog.id % ACCENT_COLORS.length],
  }

  let lift = 0
  if (action?.kind === 'jump') {
    lift = Math.round(Math.sin(Math.PI * Math.min(elapsed / (ACTIONS.jump.duration ?? 1), 1)) * JUMP_HEIGHT)
  } else if (barkOpen) {
    lift = 1 // small recoil with each woof
  }

  // Sprite is centered over the paws and its bottom edge sits on the footprint's bottom edge.
  const x = Math.round(dog.x) + Math.floor((DOG_BODY.w - SPRITE_W) / 2)
  const y = Math.round(dog.y) + DOG_BODY.h - SPRITE_H

  return {
    baseline: dog.y + DOG_BODY.h,
    draw: (c) => {
      ellipse(c, D.shadow, x + 2, y + 15, 16, 3) // stays on the floor while the dog jumps
      const top = y - lift
      if (dog.facing === 'down') drawFront(c, x, top, pose)
      else if (dog.facing === 'up') drawBack(c, x, top, pose)
      else if (dog.facing === 'right') drawSide(c, x, top, pose)
      else {
        // Facing left is the right-facing sprite mirrored around its own center.
        c.save()
        c.translate(2 * x + SPRITE_W, 0)
        c.scale(-1, 1)
        drawSide(c, x, top, pose)
        c.restore()
      }
      if (action?.kind === 'bark') drawBubble(c, x, top - 11, 'WOOF!')
      if (action?.kind === 'wag') drawHeart(c, x + 7, top - 8 - (Math.floor(elapsed / 0.3) % 2))
    },
  }
}

function drawSide(c: Ctx, x: number, y: number, p: Pose): void {
  const o = p.sitting ? 2 : 0
  const k = p.palette
  const { step: f, tail: tw } = p
  if (p.sitting) {
    px(c, k.steelDark, x + 1, y + 13, 3, 2) // tail resting on the floor
    px(c, k.steel, x + 3, y + 8, 9, 6)
    px(c, k.steelDark, x + 3, y + 8, 9, 2)
    px(c, k.tan, x + 3, y + 12, 8, 3) // haunch
    px(c, k.tan, x + 11, y + 9, 3, 7) // front legs
    px(c, k.tanLight, x + 11, y + 15, 3, 1)
  } else {
    px(c, k.tanDark, x + (f ? 4 : 6), y + 12, 2, 4) // far legs
    px(c, k.tanDark, x + (f ? 12 : 10), y + 12, 2, 4)
    px(c, k.steelDark, x, y + (tw ? 3 : 4), 2, 2) // tail
    px(c, k.steel, x + 1, y + (tw ? 4 : 5), 3, 2)
    px(c, k.steel, x + 3, y + 6, 11, 6) // body
    px(c, k.steelDark, x + 3, y + 6, 11, 2)
    px(c, k.tan, x + 3, y + 11, 11, 2)
    px(c, k.tan, x + 11, y + 7, 4, 5)
    px(c, k.tan, x + (f ? 6 : 4), y + 12, 2, 4) // near legs
    px(c, k.tan, x + (f ? 10 : 12), y + 12, 2, 4)
    px(c, k.tanLight, x + (f ? 6 : 4), y + 15, 2, 1)
    px(c, k.tanLight, x + (f ? 10 : 12), y + 15, 2, 1)
  }
  // head
  px(c, k.head, x + 13, y + 3 + o, 6, 6)
  px(c, k.tanLight, x + 16, y + 6 + o, 4, 3)
  px(c, D.black, x + 18, y + 6 + o, 2, 2)
  px(c, D.black, x + 16, y + 5 + o, 1, 1)
  if (p.mouthOpen) px(c, D.mouth, x + 17, y + 8 + o, 3, 2)
  px(c, k.steelDark, x + 13, y + 1 + o, 3, 4)
  px(c, k.steel, x + 14, y + 2 + o, 1, 2)
  px(c, p.accent, x + 15, y + o, 3, 2)
}

function drawFront(c: Ctx, x: number, y: number, p: Pose): void {
  const o = p.sitting ? 2 : 0
  const k = p.palette
  const f = p.step
  if (p.sitting) {
    px(c, k.steel, x + 4, y + 11 + o, 12, 5 - o) // body spreads out when sitting
    px(c, k.tan, x + 8, y + 11 + o, 4, 5 - o)
    px(c, k.tan, x + 6, y + 14, 2, 2) // front paws
    px(c, k.tan, x + 12, y + 14, 2, 2)
    px(c, k.tanLight, x + 6, y + 15, 2, 1)
    px(c, k.tanLight, x + 12, y + 15, 2, 1)
  } else {
    px(c, k.tan, x + 6, y + 14 - f, 2, 3)
    px(c, k.tan, x + 12, y + 13 + f, 2, 3)
    px(c, k.tanLight, x + 6, y + 16 - f, 2, 1)
    px(c, k.tanLight, x + 12, y + 15 + f, 2, 1)
    px(c, k.steel, x + 5, y + 9, 10, 6)
    px(c, k.steelDark, x + 5, y + 9, 10, 1)
    px(c, k.tan, x + 8, y + 10, 4, 5)
  }
  px(c, k.steelDark, x + 4, y + 1 + o, 3, 5)
  px(c, k.steelDark, x + 13, y + 1 + o, 3, 5)
  px(c, k.head, x + 6, y + 2 + o, 8, 7)
  px(c, k.tanLight, x + 8, y + 6 + o, 4, 3)
  px(c, D.black, x + 8, y + 4 + o, 1, 2)
  px(c, D.black, x + 11, y + 4 + o, 1, 2)
  px(c, D.black, x + 9, y + 7 + o, 2, 1)
  if (p.mouthOpen) px(c, D.mouth, x + 9, y + 8 + o, 2, 2)
  px(c, p.accent, x + 8, y + o, 4, 2)
}

function drawBack(c: Ctx, x: number, y: number, p: Pose): void {
  const o = p.sitting ? 2 : 0
  const k = p.palette
  const f = p.step
  if (p.sitting) {
    px(c, k.steel, x + 4, y + 10 + o, 12, 6 - o)
    px(c, k.steelDark, x + 9, y + 10 + o, 2, 6 - o)
    px(c, k.tan, x + 5, y + 14, 3, 2) // hind paws
    px(c, k.tan, x + 12, y + 14, 3, 2)
  } else {
    px(c, k.tan, x + 6, y + 14 - f, 2, 3)
    px(c, k.tan, x + 12, y + 13 + f, 2, 3)
    px(c, k.tanLight, x + 6, y + 16 - f, 2, 1)
    px(c, k.tanLight, x + 12, y + 15 + f, 2, 1)
    px(c, k.steel, x + 5, y + 8, 10, 7)
    px(c, k.steelDark, x + 9, y + 8, 2, 7)
  }
  px(c, k.steelDark, x + (p.tail ? 10 : 8), y + 9 + o, 2, 4) // wagging tail
  px(c, k.steelDark, x + 4, y + 1 + o, 3, 5)
  px(c, k.steelDark, x + 13, y + 1 + o, 3, 5)
  px(c, k.steel, x + 6, y + 2 + o, 8, 7)
  px(c, k.tan, x + 7, y + 7 + o, 6, 2)
  px(c, p.accent, x + 8, y + o, 4, 2)
}

/** 3x5 pixel letters, just enough for the speech bubble. */
const GLYPHS: Record<string, string[]> = {
  W: ['101', '101', '101', '111', '101'],
  O: ['111', '101', '101', '101', '111'],
  F: ['111', '100', '110', '100', '100'],
  '!': ['1', '1', '1', '0', '1'],
}

function drawBubble(c: Ctx, dogX: number, y: number, text: string): void {
  const glyphs = [...text].map((ch) => GLYPHS[ch])
  const textW = glyphs.reduce((sum, g) => sum + g[0].length, 0) + glyphs.length - 1
  const w = textW + 4
  const x = dogX + Math.floor((SPRITE_W - w) / 2)

  px(c, D.black, x, y, w, 9)
  px(c, D.white, x + 1, y + 1, w - 2, 7)
  px(c, D.black, x + Math.floor(w / 2) - 1, y + 9, 3, 1) // tail pointing at the dog
  px(c, D.white, x + Math.floor(w / 2), y + 8, 1, 1)

  let cx = x + 2
  for (const glyph of glyphs) {
    glyph.forEach((row, ry) =>
      [...row].forEach((bit, rx) => {
        if (bit === '1') px(c, D.black, cx + rx, y + 2 + ry, 1, 1)
      }),
    )
    cx += glyph[0].length + 1
  }
}

const HEART = ['01010', '11111', '11111', '01110', '00100']

function drawHeart(c: Ctx, x: number, y: number): void {
  HEART.forEach((row, ry) =>
    [...row].forEach((bit, rx) => {
      if (bit === '1') px(c, D.heart, x + rx, y + ry, 1, 1)
    }),
  )
}
