# CLAUDE.md

Guidance for working in this repository.

## Project

Pixel Pup: a pixel-art game where the player controls a Yorkshire Terrier in a house with 3 rooms. Keyboard moves the dog, collisions prevent overlap, and on-screen buttons trigger actions (jump, bark, more later). See [README.md](README.md) for the concept and roadmap.

Status: planning only. No code, build tooling, or tests exist yet. Update the Commands section below when the scaffold lands.

## Stack (planned)

- React + TypeScript + Vite
- HTML canvas for the world, with image smoothing disabled (`imageSmoothingEnabled = false`, CSS `image-rendering: pixelated`)
- React only for UI around the canvas; the game itself does not live in React state

## Commands

None yet. Add install, dev, build, test, and lint commands here once the scaffold exists.

## Architecture

Keep a hard boundary between game logic and rendering/UI.

- `src/game/`: pure TypeScript with no React or DOM imports. Loop step, dog, world, collisions. Must be unit-testable on its own.
- `src/render/`: draws a game state to a canvas. Reads state, never changes it.
- `src/ui/`: React components. Host the canvas, show action buttons, forward input.

Design decisions made so far:

Design patterns
- Forces: the same actions come from two sources (keyboard and buttons), and new actions will keep being added. The dog's animation and allowed actions depend on what it is doing now (walking, jumping, barking). Rooms and furniture are data that will change often.
- Pattern: **Command** — each action (move, jump, bark) is a small object or plain function in one registry; keys and buttons both dispatch the same commands, so adding an action means adding one entry.
- Pattern: **State** — the dog is in one state at a time (idle, walking, jumping, barking). Each state owns its animation and which transitions are legal (for example, no barking mid-jump if we decide so).
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
