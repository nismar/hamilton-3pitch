/* =============================================================================
   City of Hamilton Co-ed 3 Pitch — rendering + standings computation
   Standings are COMPUTED from game results (never hand-entered):
     • only status:"final" games in the selected round(s)
     • rainout / holiday weeks and Classic + Tournament are excluded
     • sort by win pct, then head-to-head; unresolved ties share a rank (T)
   ========================================================================== */
(function () {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const fmtPct = (p) => (p >= 1 ? "1.000" : p.toFixed(3).slice(1));

  /* ---- Standings ---------------------------------------------------------- */
  function computeStandings(rounds) {
    const rec = {}, h2h = {};
    LEAGUE.teams.forEach((t) => { rec[t.name] = { name: t.name, id: t.id, w: 0, l: 0 }; h2h[t.name] = {}; });

    LEAGUE.weeks.forEach((wk) => {
      if (wk.status !== "final" || !rounds.includes(wk.round)) return;
      wk.games.forEach((g) => {
        rec[g.winner].w += 1;
        rec[g.loser].l  += 1;
        h2h[g.winner][g.loser] = (h2h[g.winner][g.loser] || 0) + 1;
      });
    });

    const rows = LEAGUE.teams.map((t) => {
      const r = rec[t.name], gp = r.w + r.l;
      return { name: t.name, id: t.id, w: r.w, l: r.l, gp, pct: gp ? r.w / gp : 0 };
    });

    // head-to-head wins within the current round set
    const beat = (a, b) => h2h[a][b] || 0;

    // Sort: pct desc, then head-to-head among the pct-tied group, then team id.
    rows.sort((a, b) => {
      if (b.pct !== a.pct) return b.pct - a.pct;
      const d = beat(b.name, a.name) - beat(a.name, b.name); // more H2H wins ranks higher
      if (d !== 0) return d;
      return a.id - b.id; // deterministic fallback for genuine ties
    });

    // Assign ranks; adjacent teams level on pct AND head-to-head share a rank.
    rows.forEach((row, i) => {
      const prev = rows[i - 1];
      const tiedWithPrev = prev && prev.pct === row.pct && beat(prev.name, row.name) === beat(row.name, prev.name);
      if (tiedWithPrev) { row.rank = prev.rank; row.tie = prev.tie = true; }
      else row.rank = i + 1;
    });
    return rows;
  }

  const VIEWS = {
    combined: { rounds: ["RR1", "RR2"], notes: "combined" },
    rr1:      { rounds: ["RR1"],        notes: "rr1" },
    rr2:      { rounds: ["RR2"],        notes: "rr2" },
  };

  function renderStandings(view) {
    const cfg = VIEWS[view];
    const rows = computeStandings(cfg.rounds);
    const leader = rows[0];

    const body = rows.map((r) => {
      const isLeader = r.rank === 1 && !r.tie && r.gp > 0;
      return `
      <tr class="st-row${isLeader ? " st-row--leader" : ""}">
        <td class="st-rank"><span class="mono">${r.tie ? "T" : ""}${r.rank}</span></td>
        <td class="st-team">
          <span class="st-diamond" aria-hidden="true"></span>${esc(r.name)}
        </td>
        <td class="st-num mono">${r.w}</td>
        <td class="st-num mono">${r.l}</td>
        <td class="st-pct mono">${fmtPct(r.pct)}</td>
        <td class="st-bar" aria-hidden="true"><span class="bar-fill" style="--w:${(r.pct * 100).toFixed(1)}%"></span></td>
      </tr>`;
    }).join("");

    const notes = (LEAGUE.tiebreakNotes[cfg.notes] || []);
    const notesHTML = notes.length
      ? `<div class="st-notes"><span class="st-notes__k mono">Tiebreakers</span><ul>${notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>`
      : "";

    const live = view === "rr2" ? `<span class="tag tag--live">In progress</span>` : "";
    const caption = view === "combined"
      ? "Combined season · Round Robin 1 + 2"
      : view === "rr1" ? "Round Robin 1 · Final" : "Round Robin 2 · Live";

    $("#standings-panel").innerHTML = `
      <div class="st-caption"><span class="mono">${caption}</span>${live}</div>
      <table class="standings-table">
        <thead>
          <tr>
            <th class="st-rank" scope="col"><span class="mono">#</span></th>
            <th class="st-team" scope="col">Team</th>
            <th class="st-num"  scope="col"><span class="mono">W</span></th>
            <th class="st-num"  scope="col"><span class="mono">L</span></th>
            <th class="st-pct"  scope="col"><span class="mono">PCT</span></th>
            <th class="st-bar"  scope="col"><span class="vh">Win rate</span></th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
      ${notesHTML}`;

    // let the just-inserted bars animate if the section is already on screen
    requestAnimationFrame(() => $("#standings").classList.add("bars-armed"));
    return leader;
  }

  /* ---- Next Monday strip -------------------------------------------------- */
  function nextWeek() { return LEAGUE.weeks.find((w) => w.status === "upcoming"); }

  function renderNext() {
    const wk = nextWeek();
    if (!wk) return;
    const games = wk.games.map((g) => `
      <li class="next-game">
        <span class="next-match">${esc(g.away)} <span class="vs">at</span> ${esc(g.home)}</span>
        <span class="next-diamond mono">${esc(g.diamond)}</span>
      </li>`).join("");
    $("#next-strip").innerHTML = `
      <div class="next-head">
        <span class="eyebrow mono">Next Monday</span>
        <span class="next-date">${esc(wk.date)}</span>
        <span class="next-round mono">Round Robin ${wk.round === "RR2" ? "2" : "1"}</span>
      </div>
      <ul class="next-games">${games}</ul>
      <p class="next-foot mono">Away team brings the screens · home team brings the ball and bases</p>`;
  }

  /* ---- Schedule + results ------------------------------------------------- */
  function gameTeams(g) { return g.winner ? [g.winner, g.loser] : g.away ? [g.away, g.home] : (g.cancelled || []); }

  function renderSchedule(filter) {
    const upcoming = nextWeek();
    const html = LEAGUE.weeks.map((wk) => {
      // team filter: skip weeks that don't involve the team (holidays always hidden when filtered)
      if (filter !== "all") {
        if (wk.type === "holiday") return "";
        if (wk.type === "rainout") {
          if (!(wk.cancelled || []).some((m) => m.includes(filter))) return "";
        } else if (!wk.games.some((g) => gameTeams(g).includes(filter))) return "";
      }

      if (wk.type === "holiday") {
        return `<li class="wk wk--off"><div class="wk-date mono">${esc(wk.date)}</div><div class="wk-note">${esc(wk.label)}</div></li>`;
      }
      if (wk.type === "rainout") {
        const list = (wk.cancelled || []).map((m) => `<span class="cx mono">${esc(m)}</span>`).join("");
        return `<li class="wk wk--off wk--rain"><div class="wk-date mono">${esc(wk.date)}</div>
          <div class="wk-note">${esc(wk.label)}<div class="cx-list">${list}</div></div></li>`;
      }

      const isFinal = wk.status === "final";
      const isNext = upcoming && wk.date === upcoming.date;
      const games = wk.games
        .filter((g) => filter === "all" || gameTeams(g).includes(filter))
        .map((g) => {
          if (isFinal) {
            return `<li class="g g--final">
              <span class="g-teams"><b class="g-win">${esc(g.winner)}</b><span class="g-verb mono">def.</span>${esc(g.loser)}${g.forfeit ? ` <span class="tag tag--sm">forfeit</span>` : ""}</span>
              <span class="g-dia mono">${esc(g.diamond)}</span>
              ${g.note ? `<span class="g-sub">${esc(g.note)}</span>` : ""}
            </li>`;
          }
          return `<li class="g g--up">
              <span class="g-teams">${esc(g.away)} <span class="g-verb g-verb--at mono">at</span> ${esc(g.home)}</span>
              <span class="g-dia mono">${esc(g.diamond)}</span>
              ${g.tiebreak ? `<span class="g-sub g-sub--tb">${esc(g.tiebreak)}</span>` : ""}
            </li>`;
        }).join("");

      const tag = isFinal ? `<span class="tag">Final</span>` : isNext ? `<span class="tag tag--next">Next up</span>` : `<span class="tag tag--soft">Upcoming</span>`;
      return `<li class="wk${isNext ? " wk--hi" : ""}">
        <div class="wk-head"><span class="wk-date mono">${esc(wk.date)}</span>${tag}<span class="wk-round mono">${wk.round === "RR2" ? "RR2" : "RR1"}</span></div>
        <ul class="games">${games}</ul>
        ${wk.note ? `<div class="wk-foot mono">${esc(wk.note)}</div>` : ""}
      </li>`;
    }).join("");

    $("#schedule-list").innerHTML = html || `<li class="wk wk--off"><div class="wk-note">No games for this team.</div></li>`;
  }

  /* ---- Mid-Summer Classic ------------------------------------------------- */
  function renderClassic() {
    const c = LEAGUE.classic;
    const divs = c.divisions.map((d) => {
      const games = d.games.map((g) => `
        <li class="cl-game${g.crown ? " cl-game--final" : ""}">
          <span class="cl-label mono">${esc(g.label)}</span>
          <span class="cl-line"><b>${esc(g.winner)}</b> <span class="g-verb mono">def.</span> ${esc(g.loser)}</span>
        </li>`).join("");
      return `<article class="cl-div">
        <header class="cl-div__h">
          <h3>${esc(d.name)}</h3>
          <div class="champ"><span class="champ-k mono">Champion</span><span class="champ-v">${esc(d.champion)}</span></div>
        </header>
        <ul class="cl-games">${games}</ul>
      </article>`;
    }).join("");

    $("#classic-panel").innerHTML = `
      <p class="lede">${esc(c.format)}</p>
      <p class="fine mono">${esc(c.seedNote)}</p>
      <div class="cl-grid">${divs}</div>
      <div class="stories">
        ${c.storylines.map((s) => `<p class="story"><span class="story-mk" aria-hidden="true"></span>${esc(s)}</p>`).join("")}
      </div>`;
  }

  /* ---- Year-End Tournament ------------------------------------------------ */
  function renderTournament() {
    const t = LEAGUE.tournament;
    const facts = t.facts.map((f) => `<div class="fact"><dt class="mono">${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join("");
    $("#tournament-panel").innerHTML = `
      <div class="tour-top">
        <div class="tour-when"><span class="tour-dates">${esc(t.dates)}</span><span class="tour-loc mono">${esc(t.location)}</span></div>
      </div>
      <dl class="facts">${facts}</dl>
      <div class="bracket-ph">
        <span class="ph-diamond" aria-hidden="true"></span>
        <p>${esc(t.placeholder)}</p>
      </div>`;
  }

  /* ---- League info -------------------------------------------------------- */
  function renderInfo() {
    const info = LEAGUE.info;
    const duties = info.duties.map((d) => `<div class="fact"><dt class="mono">${esc(d[0])}</dt><dd>${esc(d[1])}</dd></div>`).join("");
    const rules  = info.rules.map((r) => `<li>${esc(r)}</li>`).join("");
    const teams  = LEAGUE.teams.map((t) =>
      `<li class="roster-item"><span class="roster-team">${esc(t.name)}</span><span class="roster-cap mono">${esc(t.captain)}${t.convenor ? " · convenor" : ""}</span></li>`).join("");

    $("#info-panel").innerHTML = `
      <div class="info-grid">
        <div class="info-block">
          <h3 class="info-h mono">Game times</h3>
          <p>${esc(info.times)}</p>
          <h3 class="info-h mono">On the diamond</h3>
          <dl class="facts facts--tight">${duties}</dl>
          <p class="fine">${esc(info.directions)}</p>
        </div>
        <div class="info-block">
          <h3 class="info-h mono">How standings work</h3>
          <ul class="rules">${rules}</ul>
          <p class="fine">${esc(info.reporting)}</p>
        </div>
        <div class="info-block">
          <h3 class="info-h mono">Teams &amp; captains</h3>
          <ul class="roster">${teams}</ul>
        </div>
      </div>`;
  }

  /* ---- Team filter marquee band (roster) ---------------------------------- */
  function renderMarquee() {
    const names = LEAGUE.teams.map((t) => `<span class="mq-item">${esc(t.name)}</span><span class="mq-dot" aria-hidden="true"></span>`).join("");
    $("#marquee-track").innerHTML = names + names; // duplicate for seamless loop
  }

  /* ---- Interactions ------------------------------------------------------- */
  function wireStandingsTabs() {
    const tabs = $$(".seg-btn");
    tabs.forEach((btn) => btn.addEventListener("click", () => {
      tabs.forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-pressed", b === btn); });
      renderStandings(btn.dataset.view);
    }));
  }

  function wireTeamChips() {
    const box = $("#team-chips");
    const teams = ["all", ...LEAGUE.teams.slice().sort((a, b) => a.name.localeCompare(b.name)).map((t) => t.name)];
    box.innerHTML = teams.map((t, i) =>
      `<button class="chip${i === 0 ? " is-active" : ""}" data-team="${esc(t)}" aria-pressed="${i === 0}">${t === "all" ? "All teams" : esc(t)}</button>`
    ).join("");
    box.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      $$(".chip", box).forEach((c) => { const on = c === btn; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", on); });
      renderSchedule(btn.dataset.team);
    });
  }

  function wireReveal() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      $$(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { rootMargin: "-40px 0px -10% 0px", threshold: 0.06 });
    $$(".reveal").forEach((el) => io.observe(el));
  }

  function wireNav() {
    const nav = $("#nav"), toggle = $("#nav-toggle");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
    });
    $$("#nav a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", false); }));

    // active section highlight
    const links = new Map($$("#nav a").map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          $$("#nav a").forEach((a) => a.classList.remove("is-current"));
          const a = links.get(e.target.id); if (a) a.classList.add("is-current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => spy.observe(s));
  }

  function setMeta(leader) {
    $("#updated").textContent = LEAGUE.updated;
    $$("[data-updated]").forEach((n) => (n.textContent = LEAGUE.updated));
    $("#hero-season").textContent  = LEAGUE.season.label;
    $("#hero-cadence").textContent = LEAGUE.season.cadence;
    $("#hero-place").textContent   = LEAGUE.season.place;
  }

  /* ---- Boot --------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderNext();
    renderMarquee();
    const leader = renderStandings("combined");
    renderSchedule("all");
    renderClassic();
    renderTournament();
    renderInfo();
    setMeta(leader);
    wireStandingsTabs();
    wireTeamChips();
    wireNav();
    wireReveal();
  });
})();
