/** Deterministic pseudo-random number in [0, 1) from two integers, so textures never flicker. */
export function hash(a: number, b = 0): number {
  let n = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296
}
