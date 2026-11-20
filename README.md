# Pixel Pup

A pixel-art browser game where you play with a Yorkshire Terrier. Walk the dog around a small house with three rooms, and make it jump, bark, and more.

> Status: planning. This repository currently holds only documentation. No game code exists yet.

## Concept

- Top-down pixel-art house with **3 rooms** connected by doorways.
- You control a **Yorkie** with the keyboard.
- **Collisions** keep the dog out of walls and furniture, so nothing overlaps.
- On-screen **action buttons** trigger pet actions: jump, bark, and others to come.

## Controls

| Input | Action |
|---|---|
| Arrow keys / WASD | Move the dog |
| Space | Jump |
| B | Bark |
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

1. Project scaffold (Vite, React, TypeScript, tests).
2. Game loop and keyboard-driven movement in an empty room.
3. House layout with 3 rooms, walls, doorways, and rectangle collisions.
4. Yorkie sprite with idle, walk, jump, and bark animations.
5. Action buttons wired to the same actions as the keyboard.
6. More actions, furniture, sounds.

## Getting started

Not available yet. Setup and run instructions will be added with the scaffold.
