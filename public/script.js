// Storage helpers
const LS = {
  get(key, fallback){
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch(e){ return fallback; }
  },
  set(key, value){ localStorage.setItem(key, JSON.stringify(value)); },
  reset(){ localStorage.clear(); initDemoData(); }
};

// Demo seed data
function initDemoData(){
  const demoPlayers = [
    { id:1, name:"Ocie Jr", age:13, shooting:true, team:true, teamName:"Lions", score:12 },
    { id:2, name:"Jordan P.", age:14, shooting:true, team:false, teamName:null, score:9 },
    { id:3, name:"Taylor R.", age:13, shooting:false, team:true, teamName:"Sharks", score:15 },
    { id:4, name:"Maya K.", age:12, shooting:true, team:true, teamName:"Lions", score:8 },
  ];
  const demoSpectators = [
    { id:1, name:"Smith Family", tickets:3 },
    { id:2, name:"Coach D", tickets:1 },
  ];
  const demoTeams = [
    { name:"Lions", players:[1,4] },
    { name:"Sharks", players:[3] },
    { name:"Wolves", players:[] },
    { name:"Eagles", players:[] }
  ];
  const demoShootingOrder = ["Ocie Jr","Jordan P.","Taylor R.","Maya K."];
  const demoGames = [
    { id:1, home:"Lions", away:"Sharks", hs:21, as:18 },
    { id:2, home:"Wolves", away:"Eagles", hs:14, as:21 },
  ];
  const demoBracket = [
    // Four columns (quarters -> semis -> final -> champ)
    [
      { id:"qf1", a:"Lions", b:"Sharks", as:0, bs:0 },
      { id:"qf2", a:"Wolves", b:"Eagles", as:0, bs:0 },
    ],
    [
      { id:"sf1", a:"Winner QF1", b:"Winner QF2", as:0, bs:0 },
    ],
    [
      { id:"f1", a:"Winner SF1", b:"—", as:0, bs:0 }
    ],
    [
      { id:"champ", a:"Champion", b:"", as:0, bs:0 }
    ]
  ];

  LS.set("players", demoPlayers);
  LS.set("spectators", demoSpectators);
  LS.set("teams", demoTeams);
  LS.set("shootingOrder", demoShootingOrder);
  LS.set("games", demoGames);
  LS.set("bracket", demoBracket);
}
if(!localStorage.getItem("players")) initDemoData();

// Page routers
document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname;

  // Register page
  if(path.endsWith("register.html")){
    const btnSpectator = document.getElementById("btnSpectator");
    const btnPlayer = document.getElementById("btnPlayer");
    const formSpectator = document.getElementById("formSpectator");
    const formPlayer = document.getElementById("formPlayer");

    btnSpectator.addEventListener("click", ()=>{
      formSpectator.classList.add("active");
      formPlayer.classList.remove("active");
      btnSpectator.classList.add("primary");
      btnPlayer.classList.remove("primary");
    });
    btnPlayer.addEventListener("click", ()=>{
      formPlayer.classList.add("active");
      formSpectator.classList.remove("active");
      btnPlayer.classList.add("primary");
      btnSpectator.classList.remove("primary");
    });

    formSpectator.addEventListener("submit", (e)=>{
      e.preventDefault();
      const name = document.getElementById("specName").value.trim();
      const tickets = parseInt(document.getElementById("specTickets").value||"1",10);
      if(!name) return alert("Please enter a name.");
      const spectators = LS.get("spectators", []);
      spectators.push({ id:Date.now(), name, tickets });
      LS.set("spectators", spectators);
      alert("Spectator registered!");
      formSpectator.reset();
    });

    formPlayer.addEventListener("submit", (e)=>{
      e.preventDefault();
      const name = document.getElementById("playerName").value.trim();
      const age = parseInt(document.getElementById("playerAge").value||"0",10);
      const shooting = document.getElementById("evtShooting").checked;
      const team = document.getElementById("evtTeam").checked;
      if(!name || !age) return alert("Please complete name and age.");
      const players = LS.get("players", []);
      players.push({ id:Date.now(), name, age, shooting, team, teamName:null, score:0 });
      LS.set("players", players);
      alert("Player registered!");
      e.target.reset();
    });
  }

  // Players list page
  if(path.endsWith("players.html")){
    const playerList = document.getElementById("playerList");
    const spectatorList = document.getElementById("spectatorList");
    const players = LS.get("players", []);
    const spectators = LS.get("spectators", []);
    playerList.innerHTML = players.map(p => `
      <li><b>${p.name}</b> (Age ${p.age}) — Shooting: ${p.shooting?"Yes":"No"} • Team: ${p.team?"Yes":"No"} • Team Name: ${p.teamName??"—"} • Score: ${p.score}</li>
    `).join("");
    spectatorList.innerHTML = spectators.map(s => `
      <li><b>${s.name}</b> — Tickets: ${s.tickets}</li>
    `).join("");
  }

  // Admin login page
  if(path.endsWith("admin.html")){
    const form = document.getElementById("adminLoginForm");
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      const u = document.getElementById("adminUser").value;
      const p = document.getElementById("adminPass").value;
      if(u==="admin" && p==="password13"){
        location.href = "dashboard.html";
      } else {
        alert("Invalid credentials");
      }
    });
  }

  // Dashboard
  if(path.endsWith("dashboard.html")){
    const btnReset = document.getElementById("btnReset");
    const adminPlayers = document.getElementById("adminPlayers");
    const teamsContainer = document.getElementById("teamsContainer");
    const shootingOrderEl = document.getElementById("shootingOrder");
    const addShoot = document.getElementById("addShoot");
    const shootName = document.getElementById("shootName");
    const gamesList = document.getElementById("gamesList");
    const bracketEl = document.getElementById("bracket");

    btnReset.addEventListener("click", ()=>{
      if(confirm("Reset all demo data?")){
        LS.reset();
        location.reload();
      }
    });

    let players = LS.get("players", []);
    let teams = LS.get("teams", []);
    let shootingOrder = LS.get("shootingOrder", []);
    let games = LS.get("games", []);
    let bracket = LS.get("bracket", []);

    function renderPlayers(){
      players = LS.get("players", []);
      adminPlayers.innerHTML = "";
      players.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="row">
            <div style="flex:1"><b>${p.name}</b> (Age ${p.age}) — Score: ${p.score}</div>
            <div>
              <button class="btn small" data-act="score" data-id="${p.id}">+1</button>
              <select data-act="team" data-id="${p.id}">
                <option value="">— Team —</option>
                ${teams.map(t=>`<option value="${t.name}" ${p.teamName===t.name?"selected":""}>${t.name}</option>`).join("")}
              </select>
            </div>
          </div>
        `;
        adminPlayers.appendChild(li);
      });
      adminPlayers.querySelectorAll("button[data-act='score']").forEach(btn=>{
        btn.addEventListener("click", (e)=>{
          const id = Number(e.currentTarget.getAttribute("data-id"));
          players = players.map(pl => pl.id===id ? ({...pl, score: pl.score+1}) : pl);
          LS.set("players", players);
          renderPlayers();
        });
      });
      adminPlayers.querySelectorAll("select[data-act='team']").forEach(sel=>{
        sel.addEventListener("change", (e)=>{
          const id = Number(e.currentTarget.getAttribute("data-id"));
          const teamName = e.currentTarget.value || null;
          players = players.map(pl => pl.id===id ? ({...pl, teamName}) : pl);
          LS.set("players", players);
          teams.forEach(t => {
            t.players = t.players.filter(pid => pid !== id);
            if(teamName && t.name===teamName){ t.players.push(id); }
          });
          LS.set("teams", teams);
          renderTeams();
        });
      });
    }

    function renderTeams(){
      teams = LS.get("teams", []);
      teamsContainer.innerHTML = teams.map(t => {
        const pnames = t.players.map(pid => {
          const pl = players.find(pp=>pp.id===pid);
          return pl?pl.name:"?";
        });
        return `<div class="card" style="margin:8px 0">
          <h3>${t.name}</h3>
          <p>${pnames.length? pnames.join(", ") : "No players assigned yet."}</p>
        </div>`;
      }).join("");
    }

    function renderShooting(){
      shootingOrder = LS.get("shootingOrder", []);
      shootingOrderEl.innerHTML = shootingOrder.map((n,i)=>`
        <li class="row">
          <span style="flex:1">${i+1}. ${n}</span>
          <button class="btn small" data-i="${i}">Remove</button>
        </li>
      `).join("");
      shootingOrderEl.querySelectorAll("button").forEach(b=>{
        b.addEventListener("click", (e)=>{
          const i = Number(e.currentTarget.getAttribute("data-i"));
          shootingOrder.splice(i,1);
          LS.set("shootingOrder", shootingOrder);
          renderShooting();
        });
      });
    }
    addShoot.addEventListener("click", ()=>{
      const name = shootName.value.trim();
      if(!name) return;
      shootingOrder.push(name);
      LS.set("shootingOrder", shootingOrder);
      shootName.value="";
      renderShooting();
    });

    function renderGames(){
      games = LS.get("games", []);
      gamesList.innerHTML = games.map((g,idx)=>`
        <li class="row">
          <span style="flex:1">${g.home} vs ${g.away}</span>
          <span class="score">
            <input type="number" min="0" value="${g.hs}" data-g="${idx}" data-side="hs"/> - 
            <input type="number" min="0" value="${g.as}" data-g="${idx}" data-side="as"/>
          </span>
        </li>
      `).join("");
      gamesList.querySelectorAll("input").forEach(inp=>{
        inp.addEventListener("change", (e)=>{
          const idx = Number(e.currentTarget.getAttribute("data-g"));
          const side = e.currentTarget.getAttribute("data-side");
          games[idx][side] = parseInt(e.currentTarget.value||"0",10);
          LS.set("games", games);
        });
      });
    }

    function renderBracket(){
      bracket = LS.get("bracket", []);
      bracketEl.innerHTML = bracket.map((round, rIdx)=>`
        <div class="round">
          <h4>Round ${rIdx+1}</h4>
          ${round.map(m=>`
            <div class="match" data-id="${m.id}">
              <div><b>${m.a}</b> <span class="score"><input type="number" value="${m.as||0}" data-k="as"></span></div>
              <div><b>${m.b}</b> <span class="score"><input type="number" value="${m.bs||0}" data-k="bs"></span></div>
            </div>
          `).join("")}
        </div>
      `).join("");

      bracketEl.querySelectorAll(".match input").forEach(input => {
        input.addEventListener("change", (e)=>{
          const match = e.target.closest(".match");
          const id = match.getAttribute("data-id");
          const key = e.target.getAttribute("data-k");
          const value = parseInt(e.target.value||"0",10);
          for(let r=0; r<bracket.length; r++){
            for(let m=0; m<bracket[r].length; m++){
              if(bracket[r][m].id === id){
                bracket[r][m][key] = value;
              }
            }
          }
          LS.set("bracket", bracket);
        });
      });
    }

    renderPlayers();
    renderTeams();
    renderShooting();
    renderGames();
    renderBracket();
  }
});
