// Handles registration, admin, brackets, teams, and reset
function loadPlayers() {
  return JSON.parse(localStorage.getItem('players')) || [];
}
function savePlayers(players) {
  localStorage.setItem('players', JSON.stringify(players));
}
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const players = loadPlayers();
      const name = document.getElementById('playerName').value;
      const eventType = document.getElementById('eventType').value;
      players.push({ name, eventType, team: null, score: null });
      savePlayers(players);
      alert('Registered ' + name + ' for ' + eventType);
      form.reset();
    });
  }
});
function resetTournament() {
  if (confirm('Are you sure you want to reset the tournament?')) {
    localStorage.clear();
    loadDummyData();
    alert('Tournament reset with dummy data.');
    location.reload();
  }
}