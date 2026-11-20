export type ActionKind = 'jump' | 'bark' | 'sit' | 'wag'

export interface ActionDef {
  label: string
  /** Keyboard key (event.code) that triggers it. */
  code: string
  /** Short key name shown next to the button. */
  keyHint: string
  /** Seconds it lasts, or null if it lasts until cancelled. */
  duration: number | null
  /** While it runs the dog cannot walk. */
  locksMovement: boolean
  /** Walking input cancels it (used by sit). */
  endsOnMove: boolean
}

/** Every action the dog can do. Adding one means adding an entry here and a pose in the sprite. */
export const ACTIONS: Record<ActionKind, ActionDef> = {
  jump: { label: 'Jump', code: 'Space', keyHint: 'Space', duration: 0.5, locksMovement: false, endsOnMove: false },
  bark: { label: 'Bark', code: 'KeyB', keyHint: 'B', duration: 0.6, locksMovement: true, endsOnMove: false },
  sit: { label: 'Sit', code: 'KeyE', keyHint: 'E', duration: null, locksMovement: true, endsOnMove: true },
  wag: { label: 'Wag', code: 'KeyQ', keyHint: 'Q', duration: 1.4, locksMovement: true, endsOnMove: false },
}

/** Button order in the UI. */
export const ACTION_KINDS: ActionKind[] = ['jump', 'bark', 'sit', 'wag']

/** Reverse lookup from key code to action. */
export const ACTION_BY_CODE: ReadonlyMap<string, ActionKind> = new Map(
  ACTION_KINDS.map((kind) => [ACTIONS[kind].code, kind]),
)
