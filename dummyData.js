function loadDummyData() {
  const players = [
    { name: 'Ocie James', eventType: 'team', team: 'Purple Panthers', score: null },
    { name: 'Mia Carter', eventType: 'team', team: 'Black Mambas', score: null },
    { name: 'Jayden Smith', eventType: 'team', team: 'Purple Panthers', score: null },
    { name: 'Ava Johnson', eventType: 'team', team: 'Black Mambas', score: null },
    { name: 'Liam Brown', eventType: 'shooting', team: null, score: null },
    { name: 'Zoe Williams', eventType: 'shooting', team: null, score: null }
  ];
  localStorage.setItem('players', JSON.stringify(players));
}
if (!localStorage.getItem('players')) {
  loadDummyData();
}