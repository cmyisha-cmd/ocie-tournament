if (!localStorage.getItem('players')) {
  localStorage.setItem('players', JSON.stringify([
    { name: "Ocie", age: 13, shooting: true, team: true }
  ]));
}
if (!localStorage.getItem('scores')) {
  localStorage.setItem('scores', JSON.stringify([
    { match: "Team Ocie vs Team Purple", score: "21-18" }
  ]));
}

const regForm = document.getElementById('registerForm');
if (regForm) {
  regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('playerName').value;
    const age = document.getElementById('playerAge').value;
    const shooting = document.getElementById('shootingEvent').checked;
    const team = document.getElementById('teamEvent').checked;
    let players = JSON.parse(localStorage.getItem('players'));
    players.push({ name, age, shooting, team });
    localStorage.setItem('players', JSON.stringify(players));
    alert('Player registered!');
    window.location.href = 'players.html';
  });
}

const playersList = document.getElementById('playersList');
if (playersList) {
  const players = JSON.parse(localStorage.getItem('players'));
  playersList.innerHTML = players.map(p => `<li>${p.name} (Age ${p.age}) - ${p.shooting ? 'Shooting ' : ''}${p.team ? 'Team' : ''}</li>`).join('');
  const scores = JSON.parse(localStorage.getItem('scores'));
  const tbody = document.querySelector('#scoresTable tbody');
  tbody.innerHTML = scores.map(s => `<tr><td>${s.match}</td><td>${s.score}</td></tr>`).join('');
}

const adminForm = document.getElementById('adminLoginForm');
if (adminForm) {
  adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('adminPassword').value;
    if (pass === 'admin') {
      sessionStorage.setItem('isAdmin', true);
      window.location.href = 'dashboard.html';
    } else {
      alert('Wrong password');
    }
  });
}

if (window.location.pathname.includes('dashboard.html')) {
  if (!sessionStorage.getItem('isAdmin')) {
    window.location.href = 'admin.html';
  }
  const adminPlayersList = document.getElementById('adminPlayersList');
  const players = JSON.parse(localStorage.getItem('players'));
  adminPlayersList.innerHTML = players.map(p => `<li>${p.name} (Age ${p.age})</li>`).join('');
  const scoreForm = document.getElementById('scoreForm');
  scoreForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const match = document.getElementById('matchName').value;
    const score = document.getElementById('matchScore').value;
    let scores = JSON.parse(localStorage.getItem('scores'));
    scores.push({ match, score });
    localStorage.setItem('scores', JSON.stringify(scores));
    alert('Score added!');
    window.location.reload();
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Reset everything?')) {
      localStorage.removeItem('players');
      localStorage.removeItem('scores');
      window.location.reload();
    }
  });
}
