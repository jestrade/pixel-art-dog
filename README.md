# Pixel Pup

A pixel-art browser game where you play with a Yorkshire Terrier. Walk the dog around a small house with three rooms, and make it jump, bark, and more.

> Status: early. You can walk the Yorkie around the seven-room house with the keyboard, and it collides with walls and furniture. Jump, bark, sit, and wag work from keys and on-screen buttons. The map fills the window without stretching.

## Concept

- Top-down pixel-art, single-level house with **7 rooms** connected by doorways: master bedroom, bathroom, kids' bedroom, living room, kitchen, office, and entry.
- You control a **Yorkie** with the keyboard.
- **Collisions** keep the dog out of walls and furniture, so nothing overlaps.
- On-screen **action buttons** trigger pet actions: jump, bark, and others to come.

## Controls

| Input | Action |
|---|---|
| Arrow keys / WASD | Move the dog |
| Space | Jump |
| B | Bark |
| E | Sit (press again, or walk, to stand) |
| Q | Wag tail |
| On-screen buttons | Same actions as the keys, by mouse or touch |

Keys and buttons trigger the same actions, so the two never drift apart.

## Planned stack

- **React + TypeScript**, built with **Vite**.
- **HTML canvas** for the game world, drawn with image smoothing off to keep pixels crisp.
- React for the UI around the canvas (buttons, HUD).
- No game engine at first. The scope is small enough for a plain game loop.

## Planned structure

```
src/
  game/        # pure game logic, no React: loop, dog, world, collisions
  render/      # canvas drawing and sprite handling
  ui/          # React components: canvas host, action buttons
  assets/      # sprites and sounds
```

## Roadmap

1. ~~Project scaffold (Vite, React, TypeScript, tests).~~
2. ~~House layout with 7 rooms, walls, doorways, furniture, and collision data.~~
3. ~~Game loop, Yorkie sprite, and keyboard-driven movement with collisions.~~
4. ~~Jump, bark, sit, and wag with animations.~~
5. ~~Action buttons wired to the same actions as the keyboard.~~
6. More actions, furniture, sounds.

## Getting started

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # game logic tests
```
