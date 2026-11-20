import { DOG_BODY, type Dog } from '../game/dog'
import { type Ctx, ellipse, px } from './draw'
import type { Actor } from './drawHouse'

const D = {
  steel: '#5f6d86',
  steelDark: '#475369',
  tan: '#d09a58',
  tanDark: '#a8733a',
  tanLight: '#e8bb7c',
  black: '#1a1a22',
  bow: '#d9433f',
  shadow: 'rgba(40, 24, 10, 0.3)',
}

const SPRITE_W = 20
const SPRITE_H = 18
const FRAME_SECONDS = 0.15

/** Yorkshire Terrier: steel-blue coat, tan face and legs, red hair bow. */
export function dogActor(dog: Dog): Actor {
  const frame = dog.moving ? Math.floor(dog.walkClock / FRAME_SECONDS) % 2 : 0
  // Sprite is centered over the paws and its bottom edge sits on the footprint's bottom edge.
  const x = Math.round(dog.x) + Math.floor((DOG_BODY.w - SPRITE_W) / 2)
  const y = Math.round(dog.y) + DOG_BODY.h - SPRITE_H

  return {
    baseline: dog.y + DOG_BODY.h,
    draw: (c) => {
      if (dog.facing === 'down') drawFront(c, x, y, frame)
      else if (dog.facing === 'up') drawBack(c, x, y, frame)
      else if (dog.facing === 'right') drawSide(c, x, y, frame)
      else {
        // Facing left is the right-facing sprite mirrored around its own center.
        c.save()
        c.translate(2 * x + SPRITE_W, 0)
        c.scale(-1, 1)
        drawSide(c, x, y, frame)
        c.restore()
      }
    },
  }
}

function drawSide(c: Ctx, x: number, y: number, f: number): void {
  ellipse(c, D.shadow, x + 1, y + 15, 18, 3)
  // far legs, darker
  px(c, D.tanDark, x + (f ? 4 : 6), y + 12, 2, 4)
  px(c, D.tanDark, x + (f ? 12 : 10), y + 12, 2, 4)
  // tail
  px(c, D.steelDark, x, y + (f ? 3 : 4), 2, 2)
  px(c, D.steel, x + 1, y + (f ? 4 : 5), 3, 2)
  // body
  px(c, D.steel, x + 3, y + 6, 11, 6)
  px(c, D.steelDark, x + 3, y + 6, 11, 2)
  px(c, D.tan, x + 3, y + 11, 11, 2)
  px(c, D.tan, x + 11, y + 7, 4, 5)
  // near legs
  px(c, D.tan, x + (f ? 6 : 4), y + 12, 2, 4)
  px(c, D.tan, x + (f ? 10 : 12), y + 12, 2, 4)
  px(c, D.tanLight, x + (f ? 6 : 4), y + 15, 2, 1)
  px(c, D.tanLight, x + (f ? 10 : 12), y + 15, 2, 1)
  // head
  px(c, D.tan, x + 13, y + 3, 6, 6)
  px(c, D.tanLight, x + 16, y + 6, 4, 3)
  px(c, D.black, x + 18, y + 6, 2, 2)
  px(c, D.black, x + 16, y + 5, 1, 1)
  px(c, D.steelDark, x + 13, y + 1, 3, 4)
  px(c, D.steel, x + 14, y + 2, 1, 2)
  px(c, D.bow, x + 15, y, 3, 2)
}

function drawFront(c: Ctx, x: number, y: number, f: number): void {
  ellipse(c, D.shadow, x + 2, y + 15, 16, 3)
  px(c, D.tan, x + 6, y + 14 - f, 2, 3)
  px(c, D.tan, x + 12, y + 13 + f, 2, 3)
  px(c, D.tanLight, x + 6, y + 16 - f, 2, 1)
  px(c, D.tanLight, x + 12, y + 15 + f, 2, 1)
  px(c, D.steel, x + 5, y + 9, 10, 6)
  px(c, D.steelDark, x + 5, y + 9, 10, 1)
  px(c, D.tan, x + 8, y + 10, 4, 5)
  px(c, D.steelDark, x + 4, y + 1, 3, 5)
  px(c, D.steelDark, x + 13, y + 1, 3, 5)
  px(c, D.tan, x + 6, y + 2, 8, 7)
  px(c, D.tanLight, x + 8, y + 6, 4, 3)
  px(c, D.black, x + 8, y + 4, 1, 2)
  px(c, D.black, x + 11, y + 4, 1, 2)
  px(c, D.black, x + 9, y + 7, 2, 1)
  px(c, D.bow, x + 8, y, 4, 2)
}

function drawBack(c: Ctx, x: number, y: number, f: number): void {
  ellipse(c, D.shadow, x + 2, y + 15, 16, 3)
  px(c, D.tan, x + 6, y + 14 - f, 2, 3)
  px(c, D.tan, x + 12, y + 13 + f, 2, 3)
  px(c, D.tanLight, x + 6, y + 16 - f, 2, 1)
  px(c, D.tanLight, x + 12, y + 15 + f, 2, 1)
  px(c, D.steel, x + 5, y + 8, 10, 7)
  px(c, D.steelDark, x + 9, y + 8, 2, 7)
  px(c, D.steelDark, x + (f ? 10 : 8), y + 9, 2, 4) // wagging tail
  px(c, D.steelDark, x + 4, y + 1, 3, 5)
  px(c, D.steelDark, x + 13, y + 1, 3, 5)
  px(c, D.steel, x + 6, y + 2, 8, 7)
  px(c, D.tan, x + 7, y + 7, 6, 2)
  px(c, D.bow, x + 8, y, 4, 2)
}
