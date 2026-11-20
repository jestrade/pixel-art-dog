import { useState } from 'react'
import { house } from './game/house'
import { createSession } from './game/session'
import { ActionBar } from './ui/ActionBar'
import { GameCanvas } from './ui/GameCanvas'

export function App() {
  const [session] = useState(() => createSession(house))

  return (
    <main className="app">
      <GameCanvas session={session} />
      <ActionBar session={session} />
    </main>
  )
}
