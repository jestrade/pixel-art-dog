import { useState } from 'react'
import { house } from './game/house'
import { createSession } from './game/session'
import { ActionBar } from './ui/ActionBar'
import { BreedPicker } from './ui/BreedPicker'
import { GameCanvas } from './ui/GameCanvas'
import { Joystick } from './ui/Joystick'
import { isTouchDevice } from './ui/touch'

export function App() {
  const [session] = useState(() => createSession(house))
  const [dogsOpen, setDogsOpen] = useState(false)
  const [touch] = useState(isTouchDevice)

  return (
    <main className="app">
      <div className="stage">
        <GameCanvas session={session} />
        {touch && <Joystick session={session} />}
        {dogsOpen && <BreedPicker session={session} />}
      </div>
      <ActionBar session={session} dogsOpen={dogsOpen} onToggleDogs={() => setDogsOpen((open) => !open)} />
    </main>
  )
}
