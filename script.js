let players = JSON.parse(localStorage.getItem("players")) || [];
let teams = JSON.parse(localStorage.getItem("teams")) || [];

function saveData() {
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("teams", JSON.stringify(teams));
}

document.getElementById("registerForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("playerName").value;
  const event = document.getElementById("eventChoice").value;
  players.push({ name, event, score: 0, team: null });
  saveData();
  alert(`${name} registered for ${event}!`);
  window.location.href = "index.html";
});

function renderLists() {
  const shootingList = document.getElementById("shootingList");
  const teamList = document.getElementById("teamList");
  const allPlayers = document.getElementById("allPlayers");

  if (shootingList) {
    shootingList.innerHTML = players.filter(p => p.event === "shooting")
      .map(p => `<li>${p.name} - Score: ${p.score}</li>`).join("");
  }

  if (teamList) {
    teamList.innerHTML = players.filter(p => p.event === "team")
      .map(p => `<li>${p.name} (Team: ${p.team || "Unassigned"})</li>`).join("");
  }

  if (allPlayers) {
    allPlayers.innerHTML = players
      .map(p => `<li>${p.name} - ${p.event}</li>`).join("");
  }
}

function assignTeams() {
  let teamA = [], teamB = [];
  let teamPlayers = players.filter(p => p.event === "team");
  teamPlayers.forEach((p, i) => {
    if (i % 2 === 0) { p.team = "A"; teamA.push(p.name); }
    else { p.team = "B"; teamB.push(p.name); }
  });
  teams = [teamA, teamB];
  saveData();
  renderTeams();
}

function renderTeams() {
  const teamsDiv = document.getElementById("teams");
  if (teamsDiv) {
    teamsDiv.innerHTML = `
      <p>Team A: ${teams[0]?.join(", ") || "No players"}</p>
      <p>Team B: ${teams[1]?.join(", ") || "No players"}</p>
    `;
  }
}

function renderScores() {
  const scoreSection = document.getElementById("scoreSection");
  if (scoreSection) {
    scoreSection.innerHTML = players.map((p, i) => `
      <div>
        ${p.name} (${p.event}) - Score: 
        <input type="number" value="${p.score}" onchange="updateScore(${i}, this.value)" />
      </div>
    `).join("");
  }
}

function updateScore(index, value) {
  players[index].score = Number(value);
  saveData();
  renderLists();
  renderScores();
}

function resetTournament() {
  if (confirm("Reset all players, teams, and scores?")) {
    players = [];
    teams = [];
    saveData();
    renderLists();
    renderTeams();
    renderScores();
  }
}

renderLists();
renderTeams();
renderScores();