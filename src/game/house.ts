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

/**
 * Floor plan (tiles, 34 x 43). Every room has a 4-tile back wall at its top.
 *
 *   y0   | Master bedroom | Bathroom | Kids' bedroom |
 *   y9   | Living room    | Kitchen and dining      |
 *   y23  | Office  | Entry | Patio |
 *   y32  | Garden                  |
 *
 * Rooms in a row are separated by one-tile partitions; rooms in different rows share a wall,
 * and doorways cut through it.
 */
const WALL_HEIGHT = t(4)

const room = (
  id: string,
  name: string,
  bounds: Rect,
  floorStyle: Room['floorStyle'],
  wallStyle: Room['wallStyle'],
): Room => ({ id, name, bounds, wallHeight: WALL_HEIGHT, floorStyle, wallStyle })

const rooms: Room[] = [
  room('master', 'Master bedroom', rect(0, 0, 12, 9), 'carpet', 'blue'),
  room('bathroom', 'Bathroom', rect(13, 0, 9, 9), 'bathTile', 'teal'),
  room('kids', "Kids' bedroom", rect(23, 0, 11, 9), 'carpet', 'rose'),
  room('living', 'Living room', rect(0, 9, 16, 14), 'wood', 'green'),
  room('kitchen', 'Kitchen', rect(17, 9, 17, 14), 'tile', 'cream'),
  room('office', 'Office', rect(0, 23, 13, 9), 'wood', 'blue'),
  room('entry', 'Entry', rect(13, 23, 10, 9), 'wood', 'green'),
  // Outdoors: the patio's back wall is the house's brick exterior, the garden's is a fence.
  room('patio', 'Patio', rect(23, 23, 11, 9), 'stone', 'brick'),
  room('garden', 'Garden', rect(0, 32, 34, 11), 'grass', 'fence'),
]

const furniture: Furniture[] = [
  // Master bedroom
  place('master-window', 'window', 'wall', 4.5, 1, 2.5, 2.2),
  place('master-wardrobe', 'wardrobe', 'object', 0.8, 0.8, 3, 4.2, 1.2),
  place('master-rug', 'rug', 'floor', 1.5, 6.2, 4, 2.4),
  place('master-nightstand', 'nightstand', 'object', 4.8, 4.2, 1.5, 1.5, 1.5),
  place('master-bed', 'bed', 'object', 6.5, 2.5, 5, 5, 3.4),

  // Bathroom
  place('bath-window', 'window', 'wall', 15.5, 0.8, 2.2, 1.9),
  place('bath-tub', 'bathtub', 'object', 13.5, 2.2, 4.5, 2.8, 1.4),
  place('bath-toilet', 'toilet', 'object', 18.4, 2.2, 1.5, 2.8, 1.2),
  place('bath-vanity', 'vanity', 'object', 20.1, 1.8, 1.9, 3.2, 1.2),
  place('bath-mat', 'doormat', 'floor', 15, 6.2, 3.5, 1.8),

  // Kids' bedroom
  place('kids-window', 'window', 'wall', 28, 1, 2.5, 2.2),
  place('kids-bed', 'singleBed', 'object', 24, 2.5, 3.5, 5, 3.4),
  place('kids-nightstand', 'nightstand', 'object', 27.8, 4.2, 1.5, 1.5, 1.5),
  place('kids-desk', 'desk', 'object', 30.2, 2.2, 3.4, 3, 1.4),
  place('kids-chair', 'chairBack', 'object', 31.3, 4.8, 1.4, 2, 1),
  place('kids-rug', 'rug', 'floor', 26, 6.2, 5, 2.2),
  place('kids-plant', 'plant', 'object', 32.2, 7, 1.8, 2, 1),

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
  place('plant-right', 'plant', 'object', 13.2, 14.2, 2.4, 2.4, 1),

  // Kitchen and dining area
  place('kitchen-window-1', 'window', 'wall', 21, 9.2, 2.5, 2),
  place('kitchen-window-2', 'window', 'wall', 27.8, 9.2, 2.2, 2),
  place('fridge', 'fridge', 'object', 17.6, 9.6, 2, 4.2, 1.4),
  place('counter-1', 'counter', 'object', 19.6, 10.8, 3, 3, 1.2),
  place('sink', 'sink', 'object', 22.6, 10.8, 3, 3, 1.2),
  place('stove', 'stove', 'object', 25.6, 10.8, 2, 3, 1.2),
  place('counter-2', 'counter', 'object', 27.6, 10.8, 2.4, 3, 1.2),
  place('dining-rug', 'rug', 'floor', 20.5, 16.5, 8, 5.5),
  place('chair-top-1', 'chair', 'object', 23, 16.2, 1.2, 1.4, 0.8),
  place('chair-top-2', 'chair', 'object', 25.2, 16.2, 1.2, 1.4, 0.8),
  place('dining-table', 'diningTable', 'object', 22, 17, 5, 3, 2),
  place('chair-bottom-1', 'chairBack', 'object', 23, 19.8, 1.2, 1.4, 0.8),
  place('chair-bottom-2', 'chairBack', 'object', 25.2, 19.8, 1.2, 1.4, 0.8),
  place('kitchen-plant', 'plant', 'object', 31.5, 18, 2.2, 2.6, 1),

  // Office
  place('office-frame', 'frame', 'wall', 7.4, 23.4, 1.1, 1.4),
  place('office-bookshelf', 'bookshelf', 'object', 4.4, 23.2, 2, 4.5, 1),
  place('office-desk', 'desk', 'object', 6.4, 24.6, 4, 3, 1.4),
  place('office-lamp', 'floorLamp', 'object', 10.8, 23.4, 1.1, 3.7, 0.8),
  place('office-chair', 'chairBack', 'object', 7.6, 27.4, 1.4, 2, 1),
  place('office-rug', 'rug', 'floor', 3.5, 29, 6, 2.4),
  place('office-plant', 'plant', 'object', 0.6, 29.4, 2, 2.4, 1),

  // Entry
  place('front-door', 'frontDoor', 'wall', 16.4, 23.2, 2.2, 3.8),
  place('coat-hook', 'coatHook', 'wall', 22, 24, 1, 1.7),
  place('doormat', 'doormat', 'floor', 16.2, 27.3, 2.6, 1.4),
  place('boots', 'boots', 'object', 14, 28.8, 1.5, 1, 0.7),
  place('entry-plant', 'plant', 'object', 20.9, 28.7, 1.9, 2.3, 1),

  // Patio
  place('patio-window-1', 'window', 'wall', 24.5, 24, 2.2, 2),
  place('patio-window-2', 'window', 'wall', 30.8, 24, 2.2, 2),
  place('patio-set', 'patioSet', 'object', 24.5, 26.5, 4, 4.5, 1.6),
  place('patio-planter', 'bush', 'object', 23.3, 27, 1.8, 1.6, 1),
  place('grill', 'grill', 'object', 31.5, 25.5, 1.8, 2.8, 1.2),
  place('lounger', 'lounger', 'object', 31.5, 29.2, 2.2, 2.6, 1.6),

  // Garden
  place('garden-path', 'stonePath', 'floor', 27.4, 32, 3.2, 9.5),
  place('tree-left', 'tree', 'object', 1, 33.2, 3.6, 6.4, 1.2),
  place('tree-right', 'tree', 'object', 30.2, 33.4, 3.6, 6.4, 1.2),
  place('flower-bed-1', 'flowerBed', 'object', 5.5, 36.2, 5, 1.6, 1.6),
  place('bush-1', 'bush', 'object', 11.5, 36, 2, 1.6, 1),
  place('flower-bed-2', 'flowerBed', 'object', 17.5, 36.2, 5, 1.6, 1.6),
  place('bush-2', 'bush', 'object', 24.5, 36, 2.2, 1.6, 1),
  place('bench', 'gardenBench', 'object', 6, 40.5, 3.2, 1.8, 1),
  place('doghouse', 'doghouse', 'object', 19.5, 38.6, 3, 3, 1.6),
  place('bush-3', 'bush', 'object', 1, 41, 2, 1.6, 1),
]

export const house: House = {
  width: t(34),
  height: t(43),
  rooms,
  // Partitions between neighbouring rooms in a row, each stopping above its doorway.
  walls: [rect(12, 0, 1, 6), rect(22, 0, 1, 6), rect(16, 9, 1, 7), rect(16, 19, 1, 4)],
  doorways: [
    // Master bedroom <-> bathroom, bathroom <-> kids' bedroom
    rect(12, 6, 1, 3),
    rect(22, 6, 1, 3),
    // Living room <-> kitchen
    rect(16, 16, 1, 3),
    // Master bedroom <-> living room, kids' bedroom <-> kitchen
    rect(1, 9, 3, 4),
    rect(30.5, 9, 2.8, 4),
    // Office <-> living room, entry <-> living room, entry <-> kitchen
    rect(1, 23, 3, 4),
    rect(13, 23, 3, 4),
    rect(19, 23, 3, 4),
    // Kitchen <-> patio (back door), patio <-> garden (gate)
    rect(27, 23, 3, 4),
    rect(27, 32, 4, 4),
  ],
  furniture,
  dogSpawns: [
    { x: t(1.5), y: t(16) }, // you: living room
    { x: t(30), y: t(15) }, // kitchen
    { x: t(8), y: t(8) }, // master bedroom
    { x: t(29), y: t(7.5) }, // kids' bedroom
    { x: t(20), y: t(38) }, // garden
  ],
}
