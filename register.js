document.getElementById("registrationForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const player = {
    name: formData.get("name"),
    age: formData.get("age"),
    contact: formData.get("contact"),
    events: formData.getAll("event")
  };
  let players = JSON.parse(localStorage.getItem("players") || "[]");
  players.push(player);
  localStorage.setItem("players", JSON.stringify(players));
  document.getElementById("confirmation").innerText = "Thanks for registering, " + player.name + "!";
  e.target.reset();
});