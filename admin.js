const players = JSON.parse(localStorage.getItem("players") || "[]");
const assignments = JSON.parse(localStorage.getItem("assignments") || "{}");

const playersList = document.getElementById("playersList");
playersList.innerHTML = players.map(p => `<p>${p.name} (${p.age}) - Events: ${p.events.join(", ")}</p>`).join("");

const playerSelect = document.getElementById("playerSelect");
players.forEach((p, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = p.name;
  playerSelect.appendChild(opt);
});

document.getElementById("assignForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const playerIndex = playerSelect.value;
  const teamName = document.getElementById("teamName").value;
  const player = players[playerIndex];
  if (!assignments[teamName]) assignments[teamName] = [];
  assignments[teamName].push(player);
  localStorage.setItem("assignments", JSON.stringify(assignments));
  alert(player.name + " assigned to " + teamName);
});