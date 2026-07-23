/* =============================================================================
   City of Hamilton Co-ed 3 Pitch — League data (single source of truth)
   -----------------------------------------------------------------------------
   WEEKLY UPDATE = EDIT THIS FILE ONLY.
   - Add results by changing an upcoming week's `status` to "final" and replacing
     each game's { away, home } with { winner, loser } (winner listed first),
     keeping the diamond. Standings recompute automatically.
   - Rules baked into the computation (see app.js):
       • Wins & losses only — scores are never tracked.
       • Rainout (May 25) is excluded from standings entirely.
       • Classic + Year-End Tournament never count toward standings.
       • Tiebreaker: head-to-head first; unresolved ties share a rank (T).
   - Never add captain emails or phone numbers here.
   ========================================================================== */
const LEAGUE = {
  name: "City of Hamilton Co-ed 3 Pitch",
  tagline: "Adult co-ed recreational 3-pitch baseball",
  season: {
    label: "May 11 – August 31, 2026",
    cadence: "Monday evenings",
    place: "Hamilton, Ontario",
    year: 2026,
  },
  updated: "July 20, 2026",

  teams: [
    { id: 1, name: "Coyotes",            captain: "Ritta Nazi" },
    { id: 2, name: "Bussin Balls",       captain: "John Rafuse" },
    { id: 3, name: "Protectors",         captain: "Paul Gouchie" },
    { id: 4, name: "Culture and Recked", captain: "Mike Savoy" },
    { id: 5, name: "Wildcats",           captain: "Kathy Hall" },
    { id: 6, name: "Stealers",           captain: "John Gilbert" },
    { id: 7, name: "Our Gang Homers",    captain: "Kelly Beaton" },
    { id: 8, name: "Odds & Ends",        captain: "Ramsin Kamo", convenor: true },
  ],

  /* Chronological weeks. status: "final" | "upcoming"; type: "holiday" | "rainout" */
  weeks: [
    { date: "May 11", round: "RR1", status: "final", games: [
      { winner: "Odds & Ends",     loser: "Coyotes",            diamond: "Kay Drage 1" },
      { winner: "Our Gang Homers", loser: "Bussin Balls",       diamond: "Kay Drage 2" },
      { winner: "Protectors",      loser: "Stealers",           diamond: "Turner 2", forfeit: true },
      { winner: "Wildcats",        loser: "Culture and Recked", diamond: "Turner 3" },
    ]},
    { date: "May 18", type: "holiday", label: "Victoria Day — diamonds closed" },
    { date: "May 25", type: "rainout", label: "Rained out — all 4 games cancelled, excluded from standings",
      cancelled: ["Bussin Balls v Wildcats", "Protectors v Culture and Recked", "Coyotes v Our Gang Homers", "Odds & Ends v Stealers"] },
    { date: "June 1", round: "RR1", status: "final", games: [
      { winner: "Wildcats",     loser: "Our Gang Homers",    diamond: "Kay Drage 1" },
      { winner: "Stealers",     loser: "Coyotes",            diamond: "Kay Drage 2" },
      { winner: "Odds & Ends",  loser: "Culture and Recked", diamond: "Turner 2" },
      { winner: "Protectors",   loser: "Bussin Balls",       diamond: "Turner 3" },
    ]},
    { date: "June 8", round: "RR1", status: "final", games: [
      { winner: "Culture and Recked", loser: "Stealers",     diamond: "Kay Drage 1", forfeit: true },
      { winner: "Wildcats",           loser: "Coyotes",      diamond: "Kay Drage 2" },
      { winner: "Odds & Ends",        loser: "Bussin Balls", diamond: "Turner 2" },
      { winner: "Our Gang Homers",    loser: "Protectors",   diamond: "Turner 3" },
    ]},
    { date: "June 15", round: "RR1", status: "final", games: [
      { winner: "Stealers",    loser: "Bussin Balls",       diamond: "Kay Drage 1" },
      { winner: "Odds & Ends", loser: "Our Gang Homers",    diamond: "Kay Drage 2" },
      { winner: "Wildcats",    loser: "Protectors",         diamond: "Turner 2" },
      { winner: "Coyotes",     loser: "Culture and Recked", diamond: "Turner 3" },
    ]},
    { date: "June 22", round: "RR1", status: "final", games: [
      { winner: "Coyotes",            loser: "Protectors",      diamond: "Kay Drage 1" },
      { winner: "Culture and Recked", loser: "Bussin Balls",    diamond: "Kay Drage 2" },
      { winner: "Stealers",           loser: "Our Gang Homers", diamond: "Turner 2" },
      { winner: "Odds & Ends",        loser: "Wildcats",        diamond: "Turner 3" },
    ]},
    { date: "June 29", round: "RR1", status: "final", note: "End of Round Robin 1", games: [
      { winner: "Odds & Ends",     loser: "Protectors",         diamond: "Kay Drage 1" },
      { winner: "Stealers",        loser: "Wildcats",           diamond: "Kay Drage 2" },
      { winner: "Coyotes",         loser: "Bussin Balls",       diamond: "Turner 2" },
      { winner: "Our Gang Homers", loser: "Culture and Recked", diamond: "Turner 3" },
    ]},
    { date: "July 13", round: "RR2", status: "final", games: [
      { winner: "Our Gang Homers", loser: "Bussin Balls",       diamond: "Kay Drage 1" },
      { winner: "Odds & Ends",     loser: "Coyotes",            diamond: "Kay Drage 2" },
      { winner: "Wildcats",        loser: "Culture and Recked", diamond: "Turner 2" },
      { winner: "Stealers",        loser: "Protectors",         diamond: "Turner 3" },
    ]},
    { date: "July 20", round: "RR2", status: "final", games: [
      { winner: "Our Gang Homers",    loser: "Coyotes",     diamond: "Kay Drage 1", note: "First-ever meeting of these two teams" },
      { winner: "Culture and Recked", loser: "Protectors",  diamond: "Kay Drage 2" },
      { winner: "Odds & Ends",        loser: "Stealers",    diamond: "Turner 2" },
      { winner: "Wildcats",           loser: "Bussin Balls",diamond: "Turner 3" },
    ]},
    { date: "July 27", round: "RR2", status: "upcoming", games: [
      { away: "Culture and Recked", home: "Odds & Ends",     diamond: "Kay Drage 1" },
      { away: "Wildcats",           home: "Our Gang Homers", diamond: "Kay Drage 2" },
      { away: "Protectors",         home: "Bussin Balls",    diamond: "Turner 2" },
      { away: "Stealers",           home: "Coyotes",         diamond: "Turner 3" },
    ]},
    { date: "August 3", type: "holiday", label: "Civic Holiday — diamonds closed" },
    { date: "August 10", round: "RR2", status: "upcoming", games: [
      { away: "Culture and Recked", home: "Stealers",        diamond: "Kay Drage 1" },
      { away: "Protectors",         home: "Our Gang Homers", diamond: "Kay Drage 2" },
      { away: "Wildcats",           home: "Coyotes",         diamond: "Turner 2" },
      { away: "Bussin Balls",       home: "Odds & Ends",     diamond: "Turner 3" },
    ]},
    { date: "August 17", round: "RR2", status: "upcoming", games: [
      { away: "Protectors",         home: "Wildcats", diamond: "Kay Drage 1" },
      { away: "Bussin Balls",       home: "Stealers", diamond: "Kay Drage 2" },
      { away: "Culture and Recked", home: "Coyotes",  diamond: "Turner 2", tiebreak: "Head-to-head rematch — affects the 5 / 6 tiebreak" },
      { away: "Odds & Ends",        home: "Our Gang Homers", diamond: "Turner 3" },
    ]},
    { date: "August 24", round: "RR2", status: "upcoming", games: [
      { away: "Bussin Balls",    home: "Culture and Recked", diamond: "Kay Drage 1" },
      { away: "Odds & Ends",     home: "Wildcats",           diamond: "Kay Drage 2" },
      { away: "Our Gang Homers", home: "Stealers",           diamond: "Turner 2", tiebreak: "Head-to-head rematch — affects the 3 / 4 tiebreak" },
      { away: "Protectors",      home: "Coyotes",            diamond: "Turner 3" },
    ]},
    { date: "August 31", round: "RR2", status: "upcoming", note: "Final week of the regular season", games: [
      { away: "Odds & Ends",     home: "Protectors",         diamond: "Kay Drage 1" },
      { away: "Bussin Balls",    home: "Coyotes",            diamond: "Kay Drage 2" },
      { away: "Our Gang Homers", home: "Culture and Recked", diamond: "Turner 2" },
      { away: "Stealers",        home: "Wildcats",           diamond: "Turner 3" },
    ]},
  ],

  /* Editorial tiebreaker notes shown beneath each standings view */
  tiebreakNotes: {
    combined: [
      "Stealers rank above Our Gang Homers (both 5–3) on head-to-head — Stealers won June 22. Rematch Aug 24 could still change it.",
      "Coyotes rank above Culture and Recked (both 3–5) on head-to-head — Coyotes won June 15. Rematch Aug 17 could still change it.",
    ],
    rr1: [
      "Stealers rank above Wildcats (both 4–2) on head-to-head — Stealers won June 29.",
      "Coyotes / Our Gang Homers and Culture and Recked / Protectors are unbroken ties — each pair never met in RR1 and finished level against every shared opponent.",
    ],
    rr2: [],
  },

  classic: {
    title: "Mid-Summer Classic",
    date: "July 6, 2026",
    status: "Complete",
    format: "Skill-tiered by captains' vote: the top four RR1 seeds in Division A, bottom four in Division B. Two 4-inning games per team — Round 1, then winners meet for the division final and losers meet in the consolation.",
    seedNote: "The Coyotes / Our Gang Homers RR1 tie for seed 4/5 went to a coin flip. Our Gang Homers took the Division A spot.",
    divisions: [
      { name: "Division A", champion: "Wildcats", games: [
        { label: "Round 1", winner: "Odds & Ends", loser: "Our Gang Homers" },
        { label: "Round 1", winner: "Wildcats", loser: "Stealers" },
        { label: "Final", winner: "Wildcats", loser: "Odds & Ends", crown: true },
        { label: "Consolation", winner: "Stealers", loser: "Our Gang Homers" },
      ]},
      { name: "Division B", champion: "Culture and Recked", games: [
        { label: "Round 1", winner: "Coyotes", loser: "Bussin Balls" },
        { label: "Round 1", winner: "Culture and Recked", loser: "Protectors" },
        { label: "Final", winner: "Culture and Recked", loser: "Coyotes", crown: true },
        { label: "Consolation", winner: "Protectors", loser: "Bussin Balls" },
      ]},
    ],
    storylines: [
      "Odds & Ends' only loss of the entire year — in any competition — came here, in the Division A final.",
      "Culture and Recked lifted the Division B banner despite a 3–5 league record.",
    ],
  },

  tournament: {
    title: "Year-End Tournament",
    dates: "September 12–13, 2026",
    location: "Turner Park · Diamonds 5, 6, 7 & 8",
    intro: "Two pools of four, three pool games Saturday, then a full playoff bracket Sunday. Seeds below are drawn from the current combined standings and update every week — they lock in once the regular season ends August 31.",
    pools: [
      { name: "Pool A", seeds: [1, 3, 5, 7] },
      { name: "Pool B", seeds: [2, 4, 6, 8] },
    ],
    days: [
      {
        day: "Saturday, September 12",
        sub: "Pool play — three games per team",
        slots: [
          { time: "9:00 AM", round: "Pool Play — Round 1", games: [
            { diamond: "Turner 5", pool: "A", a: 1, b: 7 },
            { diamond: "Turner 6", pool: "A", a: 3, b: 5 },
            { diamond: "Turner 7", pool: "B", a: 2, b: 8 },
            { diamond: "Turner 8", pool: "B", a: 4, b: 6 },
          ]},
          { time: "11:00 AM", round: "Pool Play — Round 2", games: [
            { diamond: "Turner 5", pool: "A", a: 1, b: 5 },
            { diamond: "Turner 6", pool: "A", a: 3, b: 7 },
            { diamond: "Turner 7", pool: "B", a: 2, b: 6 },
            { diamond: "Turner 8", pool: "B", a: 4, b: 8 },
          ]},
          { time: "12:30 PM", round: "Lunch & Beer Garden", break: true, note: "Food and beer garden — all teams" },
          { time: "1:30 PM", round: "Pool Play — Round 3", games: [
            { diamond: "Turner 5", pool: "A", a: 1, b: 3 },
            { diamond: "Turner 6", pool: "A", a: 5, b: 7 },
            { diamond: "Turner 7", pool: "B", a: 2, b: 4 },
            { diamond: "Turner 8", pool: "B", a: 6, b: 8 },
          ]},
        ],
      },
      {
        day: "Sunday, September 13",
        sub: "Playoffs — quarter-finals through the finals",
        slots: [
          { time: "9:00 AM", round: "Quarter-Finals", games: [
            { diamond: "Turner 5", label: "A1 vs B4" },
            { diamond: "Turner 6", label: "A2 vs B3" },
            { diamond: "Turner 7", label: "A3 vs B2" },
            { diamond: "Turner 8", label: "A4 vs B1" },
          ]},
          { time: "11:00 AM", round: "Semi-Finals", games: [
            { diamond: "Turner 5", label: "W(A1·B4) vs W(A2·B3)", to: "Championship" },
            { diamond: "Turner 6", label: "W(A3·B2) vs W(A4·B1)", to: "Championship" },
            { diamond: "Turner 7", label: "L(A1·B4) vs L(A2·B3)", to: "Consolation" },
            { diamond: "Turner 8", label: "L(A3·B2) vs L(A4·B1)", to: "Consolation" },
          ]},
          { time: "1:00 PM", round: "Finals", games: [
            { diamond: "Turner 5 / 6", label: "Championship", crown: true },
            { diamond: "Turner 7 / 8", label: "Consolation Final" },
          ]},
        ],
      },
    ],
    minGames: "Every team plays at least five games — three pool games plus the quarter-final and a semi-final or final.",
    seedNote: "Seeds are provisional, based on the current combined standings. Final seeding is locked after the regular season ends August 31.",
  },

  info: {
    times: "First pitch by 6:00 pm in May and September, and by 6:15 pm from June through August.",
    duties: [
      ["Away team", "Listed first in a matchup — brings the pitching screens."],
      ["Home team", "Listed second — provides a new game ball and sets up the bases."],
    ],
    directions: "Kay Drage diamonds are marked on the backstop. Turner #2 is the one closest to the police station; Turner #3 sits right beside it.",
    reporting: "Captains — email your result to the convenor by Tuesday so standings stay current for Monday.",
    rules: [
      "Wins and losses only. Scores and runs are never tracked.",
      "Playoff and tournament games don't count toward regular-season standings.",
      "The May 25 rainout was cancelled outright — those games are excluded, not rescheduled.",
      "Forfeits count as an ordinary win or loss.",
    ],
  },
};
