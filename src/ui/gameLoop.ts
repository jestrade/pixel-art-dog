/**
 * Fixed-timestep loop: `update` always runs in `step`-second slices so game speed does not
 * depend on the display's frame rate, and `render` runs once per animation frame.
 * Returns a function that stops the loop.
 */
export function startLoop(update: (dt: number) => void, render: () => void, step = 1 / 60): () => void {
  let last = performance.now()
  let pending = 0
  let frameId = 0

  const frame = (now: number) => {
    pending += Math.min((now - last) / 1000, 0.25) // cap so a background tab doesn't cause a jump
    last = now
    while (pending >= step) {
      update(step)
      pending -= step
    }
    render()
    frameId = requestAnimationFrame(frame)
  }

  frameId = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(frameId)
}
