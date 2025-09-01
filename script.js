// ====== Storage helpers ======
function getStore(key, fallback) { 
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function setStore(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// ====== Dummy Data (loaded once) ======
function loadDummy() {
  const initial = {"players": [{"name": "Ocie James", "event": "team", "team": "Purple Panthers", "score": 0}, {"name": "Mia Carter", "event": "team", "team": "Black Mambas", "score": 0}, {"name": "Jayden Brooks", "event": "team", "team": "Purple Panthers", "score": 0}, {"name": "Ava Johnson", "event": "team", "team": "Black Mambas", "score": 0}, {"name": "Liam Brown", "event": "shooting", "team": null, "score": 27}, {"name": "Zoe Williams", "event": "shooting", "team": null, "score": 23}, {"name": "Noah Reed", "event": "shooting", "team": null, "score": 21}, {"name": "Ella Martinez", "event": "shooting", "team": null, "score": 28}], "teams": {"Purple Panthers": ["Ocie James", "Jayden Brooks"], "Black Mambas": ["Mia Carter", "Ava Johnson"]}, "games": [{"home": "Purple Panthers", "away": "Black Mambas", "homeScore": 42, "awayScore": 38}]};
  setStore("players", initial.players);
  setStore("teams", initial.teams);
  setStore("games", initial.games);
}
if (!localStorage.getItem("players")) loadDummy();

// ====== Common renderers ======
function renderAll() {
  renderHome();
  renderRegister();
  renderShooting();
  renderTeam();
  renderAdmin();
}

function renderHome() {
  // nothing specific; cards are links
}

// ====== Register page ======
function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }
document.addEventListener("DOMContentLoaded", () => {
  renderAll();

  const form = document.getElementById("registerForm");
  on(form, "submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("playerName").value.trim();
    const eventChoice = document.getElementById("eventChoice").value;
    if (!name || !eventChoice) return;

    const players = getStore("players", []);
    players.push({ name, event: eventChoice, team: null, score: 0 });
    setStore("players", players);
    alert(name + " registered for " + (eventChoice === "team" ? "Team Tournament" : "Shooting Contest"));
    window.location.href = "index.html";
  });
});

// ====== Shooting page ======
function renderShooting() {
  const list = document.getElementById("shootingLeaderboard");
  const select = document.getElementById("shootingPlayer");
  const saveBtn = document.getElementById("saveShootingScore");
  if (!list || !select) return;

  const players = getStore("players", []);
  const shooting = players.filter(p => p.event === "shooting").sort((a,b)=> b.score - a.score);
  list.innerHTML = shooting.map(p => `<li><strong>${p.name}</strong> — ${p.score} pts</li>`).join("");

  select.innerHTML = players.filter(p => p.event === "shooting").map(p => `<option value="${p.name}">${p.name}</option>`).join("");
  on(saveBtn, "click", () => {
    const name = select.value;
    const score = parseInt(document.getElementById("shootingScore").value || "0", 10);
    const idx = players.findIndex(p => p.name === name);
    if (idx >= 0) { players[idx].score = score; setStore("players", players); renderShooting(); alert("Saved!"); }
  });
}

// ====== Team page ======
function renderTeam() {
  const rosters = document.getElementById("teamRosters");
  const gamesList = document.getElementById("gamesList");
  const gameSelect = document.getElementById("gameSelect");
  const saveBtn = document.getElementById("saveGameScore");
  if (!rosters || !gamesList) return;

  const teams = getStore("teams", {});
  const games = getStore("games", []);

  // Rosters
  rosters.innerHTML = Object.keys(teams).map(t => {
    const members = teams[t].join(", ");
    return `<div class="subcard"><strong>${t}</strong><br><span class="muted">${members || "No players yet"}</span></div>`;
  }).join("");

  // Games
  gamesList.innerHTML = games.map((g,i) => `<li><strong>${g.home}</strong> vs <strong>${g.away}</strong> — <span>${g.homeScore} : ${g.awayScore}</span></li>`).join("");

  if (gameSelect) {
    gameSelect.innerHTML = games.map((g,i)=> `<option value="${i}">${g.home} vs ${g.away}</option>`).join("");
  }
  on(saveBtn, "click", () => {
    const i = parseInt(document.getElementById("gameSelect").value, 10);
    const hs = parseInt(document.getElementById("homeScore").value || "0", 10);
    const as = parseInt(document.getElementById("awayScore").value || "0", 10);
    if (!isNaN(i)) {
      const games = getStore("games", []);
      games[i].homeScore = hs; games[i].awayScore = as;
      setStore("games", games);
      renderTeam();
      alert("Game result saved!");
    }
  });
}

// ====== Admin page ======
function renderAdmin() {
  const list = document.getElementById("allPlayers");
  const teamsView = document.getElementById("teamsView");
  if (!list) return;

  const players = getStore("players", []);
  list.innerHTML = players.map(p => `<li>${p.name} — ${p.event}${p.team ? " — Team: " + p.team : ""}${p.event==="shooting" ? " — Score: " + p.score : ""}</li>`).join("");

  const teams = getStore("teams", {});
  teamsView.innerHTML = Object.entries(teams).map(([name, roster]) => 
    `<div class="subcard"><strong>${name}</strong><br><span class="muted">${roster.join(", ")}</span></div>`
  ).join("");
}

function assignTeams() {
  const players = getStore("players", []);
  const teamPlayers = players.filter(p => p.event === "team");
  const a = [], b = [];
  teamPlayers.forEach((p, i) => { (i % 2 === 0 ? a : b).push(p.name); p.team = (i % 2 === 0 ? "Purple Panthers" : "Black Mambas"); });
  const teams = {"Purple Panthers": a, "Black Mambas": b};
  setStore("players", players);
  setStore("teams", teams);
  renderAdmin();
}

function resetTournament() {
  if (!confirm("This will clear all data and reload defaults. Continue?")) return;
  localStorage.clear();
  loadDummy();
  renderAll();
  alert("Tournament reset and dummy data reloaded.");
}
