import { useState } from 'react'
import { ACTION_KINDS, ACTIONS } from '../game/actions'
import type { Session } from '../game/session'

interface Props {
  session: Session
  dogsOpen: boolean
  onToggleDogs: () => void
}

/** One button per dog action, plus a run toggle and the breed picker toggle. */
export function ActionBar({ session, dogsOpen, onToggleDogs }: Props) {
  const [running, setRunning] = useState(false)

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
      <button
        type="button"
        className="action-button"
        aria-pressed={running}
        onClick={(e) => {
          session.setRunLock(!running)
          setRunning(!running)
          e.currentTarget.blur()
        }}
      >
        <span>Run</span>
        <kbd>Shift</kbd>
      </button>
      <button
        type="button"
        className="action-button"
        aria-expanded={dogsOpen}
        onClick={(e) => {
          onToggleDogs()
          e.currentTarget.blur()
        }}
      >
        <span>Dogs</span>
      </button>
    </nav>
  )
}
