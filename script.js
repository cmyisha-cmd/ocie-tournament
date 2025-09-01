
let players = JSON.parse(localStorage.getItem("players")) || [
  { name: "Ocie Jr", age: 13, shooting: true, team: true, score: 12 },
  { name: "Jordan", age: 14, shooting: true, team: false, score: 9 },
  { name: "Taylor", age: 13, shooting: false, team: true, score: 15 }
];

function savePlayers() {
  localStorage.setItem("players", JSON.stringify(players));
}

document.addEventListener("DOMContentLoaded", () => {
  // Registration
  const regForm = document.getElementById("registrationForm");
  if (regForm) {
    regForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const age = document.getElementById("age").value;
      const shooting = document.getElementById("shooting").checked;
      const team = document.getElementById("team").checked;
      players.push({ name, age, shooting, team, score: 0 });
      savePlayers();
      alert("Player registered!");
      regForm.reset();
    });
  }

  // Player list (public)
  const playerList = document.getElementById("playerList");
  if (playerList) {
    playerList.innerHTML = "";
    players.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.name} (Age ${p.age}) - Shooting: ${p.shooting ? "Yes" : "No"}, Team: ${p.team ? "Yes" : "No"}, Score: ${p.score}`;
      playerList.appendChild(li);
    });
  }

  // Admin login
  const adminForm = document.getElementById("adminLoginForm");
  if (adminForm) {
    adminForm.addEventListener("submit", e => {
      e.preventDefault();
      const user = document.getElementById("adminUser").value;
      const pass = document.getElementById("adminPass").value;
      if (user === "admin" && pass === "password123") {
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid login");
      }
    });
  }

  // Admin player list
  const adminPlayerList = document.getElementById("adminPlayerList");
  if (adminPlayerList) {
    adminPlayerList.innerHTML = "";
    players.forEach((p, i) => {
      const li = document.createElement("li");
      li.innerHTML = `${p.name} - Score: ${p.score} <button onclick="updateScore(${i})">+1 Point</button>`;
      adminPlayerList.appendChild(li);
    });
  }
});

function updateScore(index) {
  players[index].score += 1;
  savePlayers();
  location.reload();
}

function resetTournament() {
  if (confirm("Reset all players and scores?")) {
    players = [];
    savePlayers();
    location.reload();
  }
}
