import type { BreedId } from '../game/breeds'

/** Colors for one breed. Every breed shares the same silhouette and differs only in these. */
export interface DogPalette {
  /** Back, tail and the top of the body. */
  steel: string
  /** Ears and shaded parts of the coat. */
  steelDark: string
  /** Chest, legs and haunches. */
  tan: string
  /** Legs on the far side. */
  tanDark: string
  /** Muzzle and paws. */
  tanLight: string
  /** Top of the head. */
  head: string
}

export const BREED_PALETTES: Record<BreedId, DogPalette> = {
  yorkie: {
    steel: '#5f6d86',
    steelDark: '#475369',
    tan: '#d09a58',
    tanDark: '#a8733a',
    tanLight: '#e8bb7c',
    head: '#d09a58',
  },
  cream: {
    steel: '#e0c498',
    steelDark: '#c4a074',
    tan: '#ecd3a8',
    tanDark: '#c9a06c',
    tanLight: '#f7e9cc',
    head: '#ecd3a8',
  },
  corgi: {
    steel: '#d9822f',
    steelDark: '#b4631a',
    tan: '#f6e8d0',
    tanDark: '#dcc6a2',
    tanLight: '#fff7e8',
    head: '#e8993f',
  },
  husky: {
    steel: '#7f8898',
    steelDark: '#5d6677',
    tan: '#eceef2',
    tanDark: '#c9ced8',
    tanLight: '#fafbfd',
    head: '#9aa3b2',
  },
  golden: {
    steel: '#d9a444',
    steelDark: '#b8832a',
    tan: '#e8c077',
    tanDark: '#c79c4e',
    tanLight: '#f3dca4',
    head: '#e0b058',
  },
  chocolate: {
    steel: '#6b4430',
    steelDark: '#4a2e20',
    tan: '#8a5a40',
    tanDark: '#6a4430',
    tanLight: '#b08560',
    head: '#7a4e38',
  },
}

/** Hair bow color that tells the dogs apart, one per dog id. */
export const ACCENT_COLORS: readonly string[] = ['#d9433f', '#3f7fd9', '#3fae5a', '#e0b030', '#a35fd0']
