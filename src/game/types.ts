/** Axis-aligned rectangle in world pixels. */
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export type FurnitureKind =
  | 'sofa'
  | 'bookshelf'
  | 'sideTable'
  | 'floorLamp'
  | 'coffeeTable'
  | 'tvStand'
  | 'plant'
  | 'rug'
  | 'doormat'
  | 'dogBed'
  | 'frame'
  | 'window'
  | 'coatHook'
  | 'boots'
  | 'bed'
  | 'wardrobe'
  | 'nightstand'
  | 'fridge'
  | 'counter'
  | 'sink'
  | 'stove'
  | 'diningTable'
  | 'chair'
  | 'chairBack'
  | 'bathtub'
  | 'toilet'
  | 'vanity'
  | 'desk'
  | 'singleBed'
  | 'frontDoor'

/** Draw order group: floor items first, then wall decor, then y-sorted objects. */
export type Layer = 'floor' | 'wall' | 'object'

export interface Furniture {
  id: string
  kind: FurnitureKind
  layer: Layer
  /** Where the sprite is drawn. */
  sprite: Rect
  /** Solid area that blocks movement, or null if the dog can walk over it. */
  footprint: Rect | null
}

export type FloorStyle = 'wood' | 'tile' | 'bathTile' | 'carpet'
export type WallStyle = 'green' | 'blue' | 'cream' | 'teal' | 'rose'

export interface Room {
  id: string
  name: string
  /** Whole room, including the back wall at the top. */
  bounds: Rect
  /** Height in pixels of the back wall face at the top of the room. */
  wallHeight: number
  floorStyle: FloorStyle
  wallStyle: WallStyle
}

export interface House {
  /** World size in pixels. */
  width: number
  height: number
  rooms: Room[]
  /** Solid partitions between rooms. Drawn only; anything outside a floor or doorway is not walkable. */
  walls: Rect[]
  /** Openings between rooms. Walkable. */
  doorways: Rect[]
  furniture: Furniture[]
  /** Top-left corner of each dog's body when the game starts. The first one is the player's dog. */
  dogSpawns: Array<{ x: number; y: number }>
}
