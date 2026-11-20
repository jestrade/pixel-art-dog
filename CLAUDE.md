# CLAUDE.md

Guidance for working in this repository.

## Project

Pixel Pup: a pixel-art game where the player controls a Yorkshire Terrier in a house with 3 rooms. Keyboard moves the dog, collisions prevent overlap, and on-screen buttons trigger actions (jump, bark, more later). See [README.md](README.md) for the concept and roadmap.

Status: the house (3 rooms, furniture, collisions) and a walking Yorkie are built: fixed-timestep game loop, keyboard movement (arrows/WASD), wall and furniture collision with sliding. Jump, bark, and the on-screen action buttons are not built yet.

## Stack

- React + TypeScript + Vite
- HTML canvas for the world, with image smoothing disabled (`imageSmoothingEnabled = false`, CSS `image-rendering: pixelated`)
- React only for UI around the canvas; the game itself does not live in React state

## Commands

- `npm install`
- `npm run dev`: start Vite on http://localhost:5173
- `npm run build`: typecheck and build
- `npm test`: run Vitest (game logic only)

## Architecture

Keep a hard boundary between game logic and rendering/UI.

- `src/game/`: pure TypeScript with no React or DOM imports. Loop step, dog, world, collisions. Must be unit-testable on its own.
- `src/render/`: draws a game state to a canvas. Reads state, never changes it.
- `src/ui/`: React components. Host the canvas, show action buttons, forward input.

The house lives in `src/game/house.ts` (rooms, partitions, doorways, furniture in tiles of 16px) and `src/game/collision.ts` (`canOccupy`). Each furniture kind is drawn by one function in `src/render/sprites.ts`, registered in a `Record<FurnitureKind, Sprite>`; adding a kind means one type entry, one drawer, and placements in the house data. Only things in a room floor or doorway are walkable; everything else, including walls and outside space, blocks by default.

The dog is plain data (`src/game/dog.ts`: position, facing, walk clock) advanced by the pure function `stepDog(dog, direction, dt, house)`. Input is turned into a direction by `src/game/input.ts`; `src/ui/GameCanvas.tsx` owns the key listeners and runs `src/ui/gameLoop.ts`. The renderer (`src/render/drawHouse.ts`) paints static parts once to an offscreen canvas, then y-sorts furniture and "actors" (the dog) each frame so the dog passes in front of and behind furniture. The preview browser pane throttles animation to about 2 fps, so game time runs slow there; check movement with the unit tests.

Design decisions made so far:

Design patterns
- Forces: the same actions come from two sources (keyboard and buttons), and new actions will keep being added. The dog's animation and allowed actions depend on what it is doing now (walking, jumping, barking). Rooms and furniture are data that will change often.
- Pattern: **Command** — each action (move, jump, bark) is a small object or plain function in one registry; keys and buttons both dispatch the same commands, so adding an action means adding one entry.
- Pattern: **State** — the dog is in one state at a time (idle, walking, jumping, barking). Each state owns its animation and which transitions are legal (for example, no barking mid-jump if we decide so).
- Not applied yet: Command and State are planned for jump and bark. Walking alone is only "moving or not", derived from the last step, so no pattern was added for it. Introduce them with the first action that has a duration (jump).
- Cost accepted: a command registry and a small state machine instead of `if` chains, which adds a few files up front.
- Considered and rejected: Observer/event bus (React and the DOM already provide events; no custom bus needed), Singleton for the game (pass the game instance in instead), Entity-Component-System (too heavy for one dog and a few rooms), Flyweight for sprites (a handful of sprites; revisit if tiles multiply).

## Conventions

- All code, comments, commit messages, docs, and UI text are in English unless asked otherwise.
- The house is defined as data (rooms, walls, doorways, furniture as rectangles), not hardcoded in logic. Adding a room or furniture should not require touching collision code.
- Collisions use axis-aligned rectangles (AABB). Resolve movement per axis so the dog slides along walls instead of sticking.
- Use a fixed timestep for game updates and render separately, so movement speed does not depend on frame rate.
- Positions and sizes are in world pixels on a small base resolution; scale up only at render time by integer factors.
- Keep sprites as small pixel-art images on a consistent grid; no anti-aliasing or fractional scaling.
- Before designing or adding a feature, follow the `design-patterns` skill and include its "Design patterns" block in the plan.

## Testing

Test `src/game/` with unit tests (collision resolution, state transitions, command dispatch). Render and UI are checked by running the app.
