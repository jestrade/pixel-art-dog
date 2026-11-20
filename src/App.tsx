import { GameCanvas } from './ui/GameCanvas'

export function App() {
  return (
    <main className="app">
      <h1>Pixel Pup</h1>
      <GameCanvas />
      <p className="hint">Move: arrow keys or WASD</p>
    </main>
  )
}
