import type { Furniture, FurnitureKind, House, Layer, Rect, Room } from './types'

export const TILE = 16

/** Tiles to pixels. Fractions are allowed and rounded to whole pixels. */
const t = (n: number) => Math.round(n * TILE)
const rect = (x: number, y: number, w: number, h: number): Rect => ({
  x: t(x),
  y: t(y),
  w: t(w),
  h: t(h),
})

/**
 * Place a piece of furniture. All numbers are in tiles.
 * `footprintH` is the height of the solid part measured up from the sprite's bottom edge;
 * leave it out for items the dog can walk over (rugs, wall decor).
 */
function place(
  id: string,
  kind: FurnitureKind,
  layer: Layer,
  x: number,
  y: number,
  w: number,
  h: number,
  footprintH?: number,
): Furniture {
  return {
    id,
    kind,
    layer,
    sprite: rect(x, y, w, h),
    footprint: footprintH === undefined ? null : rect(x, y + h - footprintH, w, footprintH),
  }
}

const WALL_HEIGHT = t(4)

const rooms: Room[] = [
  {
    id: 'bedroom',
    name: 'Bedroom',
    bounds: rect(0, 0, 16, 9),
    wallHeight: WALL_HEIGHT,
    floorStyle: 'carpet',
    wallStyle: 'blue',
  },
  {
    id: 'living',
    name: 'Living room',
    bounds: rect(0, 9, 16, 14),
    wallHeight: WALL_HEIGHT,
    floorStyle: 'wood',
    wallStyle: 'green',
  },
  {
    id: 'entry',
    name: 'Entry',
    bounds: rect(17, 9, 7, 8),
    wallHeight: WALL_HEIGHT,
    floorStyle: 'tile',
    wallStyle: 'green',
  },
]

const furniture: Furniture[] = [
  // Bedroom
  place('window', 'window', 'wall', 5, 1, 2.5, 2.2),
  place('wardrobe', 'wardrobe', 'object', 1, 0.8, 3, 4.2, 1.2),
  place('bedroom-rug', 'rug', 'floor', 4.5, 6, 5, 2.5),
  place('bed', 'bed', 'object', 8, 2.5, 5, 5, 3.4),
  place('nightstand', 'nightstand', 'object', 13.3, 4.2, 1.5, 1.5, 1.5),

  // Living room
  place('frame-1', 'frame', 'wall', 8.8, 9.2, 1.2, 1.4),
  place('frame-2', 'frame', 'wall', 10.3, 9.1, 1, 1.3),
  place('frame-3', 'frame', 'wall', 11.6, 9.2, 1.3, 1.4),
  place('bookshelf', 'bookshelf', 'object', 4.5, 9, 2, 4.5, 1),
  place('side-table', 'sideTable', 'object', 7, 11.8, 1.5, 2, 1),
  place('sofa', 'sofa', 'object', 8.5, 10.5, 5.5, 3.5, 2),
  place('floor-lamp', 'floorLamp', 'object', 14.3, 9.8, 1.2, 3.8, 0.8),
  place('dog-bed', 'dogBed', 'floor', 1, 15.5, 3, 2.5),
  place('living-rug', 'rug', 'floor', 4.5, 15.5, 8, 5),
  place('coffee-table', 'coffeeTable', 'object', 7, 16.5, 4, 2.5, 2),
  place('plant-left', 'plant', 'object', 2.2, 19.5, 3, 3, 1.2),
  place('tv', 'tvStand', 'object', 6, 19.5, 5, 3, 1.2),
  place('plant-right', 'plant', 'object', 12.3, 19.5, 3, 3, 1.2),

  // Entry
  place('coat-hook', 'coatHook', 'wall', 19, 10, 1, 1.7),
  place('doormat', 'doormat', 'floor', 18.5, 14.8, 4.5, 1.6),
  place('boots', 'boots', 'object', 21.5, 15.3, 1.5, 1, 0.7),
]

export const house: House = {
  width: t(24),
  height: t(23),
  rooms,
  // Divider between the living room and the entry, above the doorway.
  walls: [rect(16, 9, 1, 5)],
  doorways: [
    // Bedroom <-> living room
    rect(1, 9, 3, 4),
    // Living room <-> entry
    rect(16, 14, 1, 3),
  ],
  furniture,
  dogSpawn: { x: t(1.5), y: t(16) },
}
