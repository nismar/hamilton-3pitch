# City of Hamilton Co-ed 3 Pitch — league website

A small, dependency-free static site: standings, schedule, the Mid-Summer Classic, and the Year-End Tournament. No build step, no framework.

## Files
- `index.html` — page structure
- `styles.css` — design system
- `app.js` — rendering + standings computation
- `data.js` — **the only file you edit each week** (source of truth)
- `favicon.svg`, `netlify.toml` — deploy assets

## Update results (every Monday)
Edit **`data.js`** only:
1. Find the week you want to update.
2. Change its `status: "upcoming"` to `status: "final"`.
3. For each game, replace `{ away, home }` with `{ winner, loser }` (winner first); keep the `diamond`.
4. Bump the top-level `updated:` date.

Standings recompute automatically — wins/losses only, head-to-head tiebreakers, rainout and playoff games excluded. Never add captain emails or phone numbers.

## Preview locally
Just open `index.html` in a browser (data is embedded, so it works from the file directly).

## Deploy (Netlify)
- **Drag-and-drop:** zip these files and drop the zip at https://app.netlify.com/drop.
- **Git (auto-deploy):** push this folder to GitHub and connect it in Netlify → *Add new site → Import from Git*. Every push redeploys. No build command needed; publish directory is the repo root.
