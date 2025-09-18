# Bomber-Reddit (Phaser)

A **single-player Bomberman-like** game built with Phaser 3 for the Reddit Devvit Web hackathon.
This packaged version includes playable client code, small generated pixel assets, serverless handlers for score submission, and all submission copy ready for Devpost.

## How to play
- Arrow keys / WASD to move.
- Space to place a bomb.
- Destroy destructible blocks to reveal power-ups.
- Survive and eliminate enemies to score points.
- Submit score using the 'Submit Score' button after winning.

## Tech stack
- Client: Phaser 3 (single HTML file + JS). No build step required (Phaser loaded via CDN in the HTML).
- Server: Minimal Node server example with two endpoints: `POST /api/score` and `GET /api/leaderboard`.
- Assets: Small pixel sprites (generated) in `/client/assets`.

## Run locally
Open `client/index.html` in a browser for a local demo (no build step required).
For the server, use Node 18+ to run `server/index.js` (example server writes to memory).

## Devvit notes
- Server endpoints must be short-lived — keep processing fast.
- No websockets; leaderboard uses simple HTTP get/post.
- Replace `your-domain.com` in devvit.json with your deployment origin.

## Files of interest
- client/index.html — launcher + Phaser game
- client/game.js — Phaser game logic (map, bombs, enemies, power-ups)
- client/assets/* — small sprite PNGs
- server/api/score.js — serverless handler for score submission
- server/api/leaderboard.js — serverless handler for leaderboard retrieval
- demo_post.txt — demo Reddit post body ready to paste into a public test subreddit
- devpost_description.txt — suggested Devpost project description and tags


## Completed: React wrapper + deployment & CI instructions
- Added a React-based wrapper (client/app.jsx) that embeds the Phaser game.
- Added vercel.json and netlify.toml for one-click deploy.
- Added helper to set devvit origin and CI-ready files.

Note: I cannot push to GitHub or record the demo video for you — you'll need to run `git init` and push, and record the 60s walkthrough locally.
