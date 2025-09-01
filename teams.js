const teamsList = document.getElementById("teamsList");
const players = JSON.parse(localStorage.getItem("players") || "[]");
const assignments = JSON.parse(localStorage.getItem("assignments") || "{}");

if (Object.keys(assignments).length === 0) {
  teamsList.innerHTML = "<p>No teams assigned yet.</p>";
} else {
  for (const [team, members] of Object.entries(assignments)) {
    const div = document.createElement("div");
    div.innerHTML = "<h2>" + team + "</h2><ul>" + members.map(m => "<li>" + m.name + "</li>").join("") + "</ul>";
    teamsList.appendChild(div);
  }
}