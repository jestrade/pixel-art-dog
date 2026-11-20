import type { Rect } from '../game/types'

export type Ctx = CanvasRenderingContext2D

/** Fill a rectangle snapped to whole pixels. */
export function px(c: Ctx, color: string, x: number, y: number, w: number, h: number): void {
  c.fillStyle = color
  c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

/** Fill an ellipse row by row so its edges stay pixel-crisp. */
export function ellipse(c: Ctx, color: string, x: number, y: number, w: number, h: number): void {
  for (let i = 0; i < h; i++) {
    const dy = (i + 0.5 - h / 2) / (h / 2)
    const half = (Math.sqrt(Math.max(0, 1 - dy * dy)) * w) / 2
    px(c, color, x + w / 2 - half, y + i, half * 2, 1)
  }
}

/** Run `paint` with drawing limited to `area`. */
export function clipped(c: Ctx, area: Rect, paint: () => void): void {
  c.save()
  c.beginPath()
  c.rect(area.x, area.y, area.w, area.h)
  c.clip()
  paint()
  c.restore()
}
