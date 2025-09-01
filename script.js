// Dummy data
let players = JSON.parse(localStorage.getItem('players')) || [
  { name: "Jordan", age: 13, shooting: true, team: false },
  { name: "Taylor", age: 12, shooting: false, team: true }
];

let scores = JSON.parse(localStorage.getItem('scores')) || [
  { player: "Jordan", event: "Shooting Contest", score: 12 },
  { player: "Taylor", event: "Team Tournament", score: 8 }
];

// Save players
function savePlayers() {
  localStorage.setItem('players', JSON.stringify(players));
}
// Save scores
function saveScores() {
  localStorage.setItem('scores', JSON.stringify(scores));
}

// Registration form
const regForm = document.getElementById('registrationForm');
if (regForm) {
  regForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const shooting = document.getElementById('shooting').checked;
    const team = document.getElementById('team').checked;
    players.push({ name, age, shooting, team });
    savePlayers();
    alert("Player registered!");
    regForm.reset();
  });
}

// Public player list
const playerList = document.getElementById('playerList');
if (playerList) {
  playerList.innerHTML = players.map(p =>
    `<li>${p.name} (Age: ${p.age}) - ${p.shooting ? "Shooting " : ""}${p.team ? "Team " : ""}</li>`
  ).join("");
}

// Admin login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if (user === "admin" && pass === "password123") {
      window.location.href = "admin.html";
    } else {
      document.getElementById('loginError').textContent = "Invalid credentials";
    }
  });
}

// Admin player list
const adminPlayerList = document.getElementById('adminPlayerList');
if (adminPlayerList) {
  adminPlayerList.innerHTML = players.map(p =>
    `<li>${p.name} - Shooting: ${p.shooting}, Team: ${p.team}</li>`
  ).join("");
}

// Admin scores
const scoresList = document.getElementById('scoresList');
if (scoresList) {
  scoresList.innerHTML = scores.map(s =>
    `<li>${s.player} - ${s.event}: ${s.score} points</li>`
  ).join("");
}

// Reset tournament
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (confirm("Reset tournament?")) {
      players = [];
      scores = [];
      savePlayers();
      saveScores();
      window.location.reload();
    }
  });
}
