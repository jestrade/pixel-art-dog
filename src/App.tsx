import { useState } from 'react'
import { house } from './game/house'
import { createSession } from './game/session'
import { ActionBar } from './ui/ActionBar'
import { BreedPicker } from './ui/BreedPicker'
import { GameCanvas } from './ui/GameCanvas'

export function App() {
  const [session] = useState(() => createSession(house))
  const [dogsOpen, setDogsOpen] = useState(false)

  return (
    <main className="app">
      <div className="stage">
        <GameCanvas session={session} />
        {dogsOpen && <BreedPicker session={session} />}
      </div>
      <ActionBar session={session} dogsOpen={dogsOpen} onToggleDogs={() => setDogsOpen((open) => !open)} />
    </main>
  )
}
