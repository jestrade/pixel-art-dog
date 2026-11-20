import { ACTION_KINDS, ACTIONS } from '../game/actions'
import type { Session } from '../game/session'

/** One button per dog action. Each runs the same command as its keyboard shortcut. */
export function ActionBar({ session }: { session: Session }) {
  return (
    <nav className="action-bar" aria-label="Dog actions">
      {ACTION_KINDS.map((kind) => (
        <button
          key={kind}
          type="button"
          className="action-button"
          onClick={(e) => {
            session.perform(kind)
            e.currentTarget.blur() // otherwise Space would press the focused button as well as jump
          }}
        >
          <span>{ACTIONS[kind].label}</span>
          <kbd>{ACTIONS[kind].keyHint}</kbd>
        </button>
      ))}
    </nav>
  )
}
