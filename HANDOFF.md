# Maintainer Handoff — City of Hamilton Co-ed 3 Pitch

A running snapshot so anyone (or a fresh Claude session) can pick this up on any machine.

- **Live site:** https://coh-3pitch.netlify.app
- **Repo:** https://github.com/nismar/hamilton-3pitch — auto-deploys to Netlify on every push to `main`
- **What it is:** a dependency-free static site (no build step, no framework)

## Files
| File | Role |
|------|------|
| `index.html` | Page structure (single-page hub with sticky nav) |
| `styles.css` | Design system (neutral palette, Bricolage / Inter / IBM Plex Mono) |
| `app.js` | Renders everything; **computes standings from results** |
| `data.js` | **The only file you edit each week** — the source of truth |
| `favicon.svg`, `netlify.toml` | Deploy assets |

## Weekly update (the main recurring task)
Edit **`data.js`** only:
1. Find the week in `weeks[]` you're updating.
2. Change its `status: "upcoming"` → `status: "final"`.
3. For each game, replace `{ away, home }` with `{ winner, loser }` (winner first); keep the `diamond`.
4. Bump the top-level `updated:` date.
5. Deploy:
   ```bash
   git commit -am "Results for <date>"
   git push
   ```
   Netlify redeploys in ~20 seconds.

## What updates itself (do NOT hand-edit these)
- **Standings** are computed from game results — wins/losses only, head-to-head tiebreakers, with the May 25 rainout and all Classic/Tournament games excluded.
- **Tournament pools and Saturday matchups** auto-seed from the live combined standings (seed 1 = current leader). The Sunday bracket stays as `A1 vs B4`-style placeholders until Saturday's pool results exist.
- **Storyline copy** in `data.js` can embed a `{record:Team Name}` token — it resolves at render time to that team's live combined W–L, so written copy never goes stale.

## Data rules (do not break)
- **Wins and losses only** — never display runs/scores (no RS/RA/RD).
- **No captain emails or phone numbers** anywhere. Names are fine.
- Keep the tournament's **internal budget/staffing notes** (umpire cost, Smart Serve bartender) **off the public site**.

## Local preview (optional)
The data is embedded, so you can just open `index.html` in a browser. For a server, any static server works (Node only needed for that, not for editing/deploying).

## Open items / watch-outs
- **After Sept 12–13, 2026:** enter the real tournament pool finishes and bracket results (currently the Sunday side is placeholders).
- The Classic storyline reads "…despite a `{record:Culture and Recked}` league record." The word **"despite"** assumes a *losing* record — revisit that one sentence if Culture and Recked finish above .500.
- Heads-up for reference: the original planning doc (`league-website-handoff.md`, kept off-repo) had an error — it said Odds & Ends had "two losses" at the Mid-Summer Classic. It's **one** (they lost only the Division A final; 8–0 in the regular season). Already corrected on the site.

## Machine notes
- Everything needed to run and maintain the site is in **this repo** — clone it and go.
- On the original work PC there was extra local setup (a portable Node install and MCP servers: Magic UI, shadcn, Hostinger) that lived **outside this repo** and is **not needed** to maintain the site. On a new machine, just install Node normally if you want local preview.
