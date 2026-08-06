# AE Trade Sim — Project Context

Internal testing tool simulating ÆRTHLING toy pulls and player-to-player trading.
Not security-sensitive — Firestore is in test mode, no real auth needed beyond
anonymous sessions.

## Stack

- React + Vite (frontend)
- Firebase: Firestore (data) + Anonymous Auth (session persistence)
- Hosted on GitHub Pages via GitHub Actions (repo: `ae-trade-sim`)
- Firebase config lives in `src/firebase.js` — not a secret, safe to commit

## Core concept: physical toys vs. digital characters

This is the trickiest part of the domain model, so it's worth being precise:

- A **physical toy** represents one real-world blind-box pull. It has a fixed
  **species** (e.g. "Lennisaur") set permanently at pull time. The species
  never changes, no matter how many times the toy is traded.
- Every player who has ever owned that physical toy gets their **own personal
  digital ÆRTHLING** of that species — with its own independently-rolled star
  rating. Trading the toy to a new player generates a *new* digital character
  for them (same species, different star roll), it does **not** transfer the
  original owner's digital character.
- **Tradebacks are not allowed** — a toy can never be traded back to a player
  who has previously owned it. This is enforced by checking whether the
  incoming player's ID already appears anywhere in the toy's ownership chain.
- You should be able to **inspect a toy** and see its full ownership history:
  every player who's held it, when, and what star rating they rolled.

## Data model (Firestore)

### `players/{uid}`
```js
{
  name: string,
  collection: [toyId, ...],   // toys currently owned
  everOwned: [toyId, ...],    // toys ever owned, never shrinks (survives trades away)
  currentRoom: roomId | null,
}
```
`uid` comes from Firebase Anonymous Auth and is cached in the browser, so a
page reload resumes the same player. A different browser/incognito = a new
anonymous player (this is intentional — cross-device persistence is NOT a
goal, cross-reload persistence is).

### `physicalToys/{toyId}`
```js
{
  species: string,       // e.g. "Lennisaur" — fixed forever at pull time
  rarity: string,        // e.g. "Rare" — cosmetic only, derived from species
  createdAt: timestamp,
  pulledBy: playerId,     // original puller, never changes
  currentOwner: playerId, // updates on each trade
  ownershipChain: [
    {
      playerId: string,
      acquiredAt: timestamp,
      method: "pulled" | "traded",
      starRating: "1" | "2" | "3" | "4" | "5" | "platinum",
    },
    ...
  ],
}
```
The `ownershipChain` is append-only. It's the source of truth for: tradeback
prevention (check `playerId` isn't already in the chain), the toy inspector
view (render the whole chain), and each owner's digital character display
(look up their entry to get their `starRating`).

### `tradeRooms/{roomId}` — NOT YET BUILT
Planned shape, not yet implemented:
```js
{
  name: string,
  createdAt: timestamp,
  members: [playerId, ...],
}
```
Trade requests planned as a subcollection: `tradeRooms/{roomId}/trades/{tradeId}`
with `fromPlayer`, `toPlayer`, offered/requested toy IDs, and `status`
("pending" | "accepted" | "declined"). Accepting a trade should be a Firestore
**transaction** that updates both players' `collection`/`everOwned` and
appends to the toy's `ownershipChain` atomically — and must check the
tradeback rule before allowing acceptance.

## Species roster & pull rates (weighted, see `src/gameData.js`)

24 species across 4 rarity tiers (Common/Rare/Epic/Legendary), each with a
weight — total weight 96. Rarity is cosmetic/display-only, doesn't affect
trading mechanics. Full list and weights already implemented in
`src/gameData.js`, `rollSpecies()`.

## Star rating rates (see `src/starRating.js`)

Two different weighted tables depending on how the digital character was
generated — **not** the same odds for pulling vs. trading:

**On original pull** (`method: "pulled"`) — total weight 25:
- 3★: 8, 4★: 8, 5★: 8, Platinum: 1

**On receiving via trade** (`method: "traded"`) — total weight 41:
- 1★: 8, 2★: 8, 3★: 8, 4★: 8, 5★: 8, Platinum: 1

Note pulls can never roll 1★ or 2★ — those only happen on trade-received
characters. `rollStarRating(method)` picks the right table.

## What's built so far

- `src/firebase.js` — Firebase init, exports `auth` and `db`
- `src/usePlayer.js` — hook: anonymous sign-in, loads/creates `players/{uid}` doc
- `src/components/NameEntry.jsx` — first-time name prompt
- `src/gameData.js` — species roster + `rollSpecies()`
- `src/starRating.js` — `rollStarRating(method)`
- `src/pull.js` — `pullToy(uid)`: rolls species + star rating, creates the
  `physicalToys` doc, adds toy ID to player's `collection`/`everOwned`
- `src/components/PullPanel.jsx` — button UI, shows result of last pull
- `src/App.jsx` — wires the above together; currently uses a local
  `pullHistory` array as a stopgap to reflect pull counts on screen since
  there's no live listener on the player doc yet

## Known gaps / stopgaps to address next

1. **No live listener on the player doc.** `player` state in `usePlayer`
   only loads once on mount — it doesn't reflect Firestore updates after a
   pull or trade. `App.jsx` currently papers over this with a local
   `pullHistory` counter. Should switch to `onSnapshot` on the player doc.
2. **No collection view yet** — nothing renders the list of toys a player
   owns (would need to fetch each `physicalToys` doc by ID from `collection`).
3. **No toy inspector view** — nothing renders a single toy's full
   `ownershipChain` yet.
4. **Trade rooms, presence, and trade request flow are entirely unbuilt** —
   this is the next major chunk of work. See planned shape above.
5. Firestore is in test mode (open read/write) — deliberate, since this is
   internal-only and security isn't a goal here.

## Deployment

- `vite.config.js` sets `base: '/ae-trade-sim/'` to match the GitHub repo name
- `.github/workflows/deploy.yml` builds and deploys to GitHub Pages on push
  to `main` via `actions/deploy-pages`
