export type BreedId = 'yorkie' | 'cream' | 'corgi' | 'husky' | 'golden' | 'chocolate'

/** Breeds in the order the selector lists them. Colors live in `render/breedPalettes.ts`. */
export const BREEDS: ReadonlyArray<{ id: BreedId; label: string }> = [
  { id: 'yorkie', label: 'Yorkshire Terrier' },
  { id: 'cream', label: 'Cream Terrier' },
  { id: 'corgi', label: 'Corgi' },
  { id: 'husky', label: 'Husky' },
  { id: 'golden', label: 'Golden Retriever' },
  { id: 'chocolate', label: 'Chocolate Lab' },
]

/** Breed each dog starts with. The first dog is the one you control. */
export const DEFAULT_BREEDS: readonly BreedId[] = ['cream', 'yorkie', 'corgi', 'husky', 'golden']

/** Names shown in the selector, one per dog. */
export const DOG_NAMES: readonly string[] = ['You', 'Biscuit', 'Mochi', 'Pepper', 'Waffles']
