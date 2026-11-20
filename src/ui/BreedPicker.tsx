import { useState } from 'react'
import { BREEDS, DOG_NAMES, type BreedId } from '../game/breeds'
import type { Session } from '../game/session'
import { ACCENT_COLORS, BREED_PALETTES } from '../render/breedPalettes'

/** Lets you choose a breed for each dog, including the one you control. */
export function BreedPicker({ session }: { session: Session }) {
  const [breeds, setBreeds] = useState<BreedId[]>(() => session.getDogs().map((dog) => dog.breed))

  const choose = (id: number, breed: BreedId) => {
    session.setBreed(id, breed)
    setBreeds((current) => current.map((b, i) => (i === id ? breed : b)))
  }

  return (
    <section className="dog-panel" aria-label="Choose a breed for each dog">
      <h2>Dogs</h2>
      {breeds.map((breed, id) => {
        const palette = BREED_PALETTES[breed]
        return (
          <label key={id} className="dog-row">
            <span className="dog-bow" style={{ background: ACCENT_COLORS[id % ACCENT_COLORS.length] }} aria-hidden />
            <span className="dog-name">{DOG_NAMES[id] ?? `Dog ${id + 1}`}</span>
            <span
              className="dog-swatch"
              style={{ background: `linear-gradient(90deg, ${palette.head} 50%, ${palette.steel} 50%)` }}
              aria-hidden
            />
            <select
              value={breed}
              onChange={(e) => {
                choose(id, e.target.value as BreedId)
                e.currentTarget.blur() // so the arrow keys steer the dog again
              }}
            >
              {BREEDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
        )
      })}
    </section>
  )
}
