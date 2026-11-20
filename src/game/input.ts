export interface Direction {
  x: number
  y: number
}

const LEFT = ['ArrowLeft', 'KeyA']
const RIGHT = ['ArrowRight', 'KeyD']
const UP = ['ArrowUp', 'KeyW']
const DOWN = ['ArrowDown', 'KeyS']

/** Every key code that moves the dog. */
export const MOVE_KEYS: ReadonlySet<string> = new Set([...LEFT, ...RIGHT, ...UP, ...DOWN])

const anyDown = (keys: ReadonlySet<string>, codes: string[]) => codes.some((code) => keys.has(code))

/** Unit-length movement direction for the keys currently held. Opposite keys cancel out. */
export function directionFromKeys(keys: ReadonlySet<string>): Direction {
  const x = Number(anyDown(keys, RIGHT)) - Number(anyDown(keys, LEFT))
  const y = Number(anyDown(keys, DOWN)) - Number(anyDown(keys, UP))
  if (x !== 0 && y !== 0) return { x: x * Math.SQRT1_2, y: y * Math.SQRT1_2 }
  return { x, y }
}
