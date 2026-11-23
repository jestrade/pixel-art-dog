# CLAUDE.md

Guidance for working in this repository.

## Project

Pixel Pup: a pixel-art game where the player controls a Yorkshire Terrier in a house with 3 rooms. Keyboard moves the dog, collisions prevent overlap, and on-screen buttons trigger actions (jump, bark, more later). See [README.md](README.md) for the concept and roadmap.

Status: the single-level house with a patio and a garden (9 areas: master bedroom, bathroom, kids' bedroom, living room, kitchen, office, entry, patio, garden; furniture; collisions) and five dogs are built: fixed-timestep game loop, keyboard movement (arrows/WASD, Shift to run), wall, furniture and dog-to-dog collision with sliding. One dog is yours; the other four wander on their own (walk, run, jump, bark, wag, sit). Each dog's breed can be changed from the Dogs panel. Actions (jump, bark, sit, wag) work from on-screen buttons and keys (Space, B, E, Q). The map scales to fill the window above the button bar, keeping its proportions. A Zoom button zooms to the room the player's dog is in (the view glides to the next room when the dog changes rooms) and Exit zoom returns to the whole house.

## Stack

- React + TypeScript + Vite
- HTML canvas for the world, with image smoothing disabled (`imageSmoothingEnabled = false`, CSS `image-rendering: pixelated`)
- React only for UI around the canvas; the game itself does not live in React state

## Commands

- `npm install`
- `npm run dev`: start Vite on http://localhost:5173
- `npm run dev:lan`: same, but listens on the local network so an iPhone or iPad can open it
- `npm run build`: typecheck and build
- `npm test`: run Vitest (game logic only)

## Architecture

Keep a hard boundary between game logic and rendering/UI.

- `src/game/`: pure TypeScript with no React or DOM imports. Loop step, dog, world, collisions. Must be unit-testable on its own.
- `src/render/`: draws a game state to a canvas. Reads state, never changes it.
- `src/ui/`: React components. Host the canvas, show action buttons, forward input.

The house lives in `src/game/house.ts` (rooms, partitions, doorways, furniture in tiles of 16px; the floor plan is sketched in a comment there). Rooms in one row are split by one-tile partitions, rooms in different rows share a wall (each room has a 4-tile back wall at its top), and doorways cut through either. Outdoor areas use the same model as rooms: the patio's back wall is brick (the house's outside wall) and the garden's is a fence; floors are `stone` and `grass`. Doorways and furniture must leave at least 12px (the dog's width) to walk through; the reachability test in `house.test.ts` enforces that every room can be reached and `src/game/collision.ts` (`canOccupy`). Each furniture kind is drawn by one function in `src/render/sprites.ts`, registered in a `Record<FurnitureKind, Sprite>`; adding a kind means one type entry, one drawer, and placements in the house data. Only things in a room floor or doorway are walkable; everything else, including walls and outside space, blocks by default.

Each dog is plain data (`src/game/dog.ts`: id, breed, position, facing, running, walk clock, current action) advanced by the pure function `stepDog(dog, direction, dt, house)`. Input is turned into a direction by `src/game/input.ts`; `src/ui/GameCanvas.tsx` owns the key listeners and runs `src/ui/gameLoop.ts`. The renderer (`src/render/drawHouse.ts`) paints static parts once to an offscreen canvas, then y-sorts furniture and "actors" (the dog) each frame so the dog passes in front of and behind furniture. The preview browser pane throttles animation to about 2 fps, so game time runs slow there; check movement with the unit tests.

Actions: `src/game/actions.ts` is a registry (label, key, duration, whether it locks movement). `performAction` and `stepDog` in `src/game/dog.ts` apply it: the dog's `action` field is the current state, and the registry says what that state allows. `src/game/session.ts` holds the running game; keys and `src/ui/ActionBar.tsx` buttons both call `session.perform(kind)`. To add an action: one registry entry, one pose in `src/render/dogSprite.ts`.

Several dogs: `src/game/session.ts` holds every dog with a `Controller` (`src/game/controllers.ts`): the player's dog reads the keyboard, the others use `createWanderer(rng)`. Each tick a controller returns an intent (direction, run, action), so adding a different behaviour means writing another controller. Randomness is injected (`src/game/random.ts`), so tests use a seeded generator. Breeds are colors only (`src/render/breedPalettes.ts`, names in `src/game/breeds.ts`): all breeds share one silhouette, and each dog's hair bow color (by id) tells dogs of the same breed apart. Spawn spots are in `house.dogSpawns` and the tests check they are free.

Camera: `src/game/camera.ts` holds pure helpers (`roomContaining`, `roomView`, `houseView`, `stepView` for the smooth, frame-rate independent glide, `fitView` to fill the screen undistorted). The session owns the current view (`getView()`) and the zoom flag (`setZoom`); in a doorway the dog is in no room, so the view stays on the last room. The renderer draws the world once per frame at its own resolution into an offscreen canvas, then scales the part inside the view onto the visible canvas with smoothing off; `GameCanvas` keeps the canvas's pixel size equal to its on-screen size (ResizeObserver + devicePixelRatio).

Touch: `src/ui/Joystick.tsx` (shown when `isTouchDevice()` is true, or with `?touch` in the URL) calls `session.setStick(unit vector)`; held keys win over the stick. The stick uses pointer events with pointer capture and `touch-action: none`, which is what stops iOS from scrolling or zooming while a finger is on it. Keep iOS in mind in styles: form controls at 16px or larger (smaller ones make Safari zoom), safe-area insets, and no hover-only UI.

Design decisions made so far:

Design patterns
- Forces: the same actions come from two sources (keyboard and buttons), and new actions will keep being added. The dog's animation and allowed actions depend on what it is doing now (walking, jumping, barking). Rooms and furniture are data that will change often.
- Pattern: **Command** — each action (move, jump, bark) is a small object or plain function in one registry; keys and buttons both dispatch the same commands, so adding an action means adding one entry.
- Pattern: **State** — the dog is in one state at a time (idle, walking, jumping, barking). Each state owns its animation and which transitions are legal (for example, no barking mid-jump if we decide so).
- Applied for the actions: Command as a data registry plus one `perform` entry point (no class per action, since the actions differ only in data), and State as `dog.action` with the registry deciding what each state allows. Walking stays plain movement.
- Applied for the extra dogs: Strategy as a `Controller` function (keyboard vs wandering) and breeds as a data registry of palettes. Rejected: a class per breed (breeds differ only in color), and an event bus between dogs (each dog just reads the others' bodies as blockers).
- Cost accepted: a command registry and a small state machine instead of `if` chains, which adds a few files up front.
- Considered and rejected: Observer/event bus (React and the DOM already provide events; no custom bus needed), Singleton for the game (pass the game instance in instead), Entity-Component-System (too heavy for one dog and a few rooms), Flyweight for sprites (a handful of sprites; revisit if tiles multiply).

## Conventions

- All code, comments, commit messages, docs, and UI text are in English unless asked otherwise.
- The house is defined as data (rooms, walls, doorways, furniture as rectangles), not hardcoded in logic. Adding a room or furniture should not require touching collision code.
- Collisions use axis-aligned rectangles (AABB). Resolve movement per axis so the dog slides along walls instead of sticking.
- Use a fixed timestep for game updates and render separately, so movement speed does not depend on frame rate.
- Positions and sizes are in world pixels on a small base resolution; scale up only at render time (the view fills the window, so the scale can be fractional).
- Keep sprites as small pixel-art images on a consistent grid; no anti-aliasing or fractional scaling.
- Before designing or adding a feature, follow the `design-patterns` skill and include its "Design patterns" block in the plan.

## Testing

Test `src/game/` with unit tests (collision resolution, state transitions, command dispatch). Render and UI are checked by running the app.
