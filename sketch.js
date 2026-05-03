const TILES = [
  {name:"GO",type:"go",price:0,baseRent:0,color:"#2ecc71"},
  {name:"Tisch",type:"land",price:100,baseRent:10,color:"#9b59b6"},
  {name:"Tandon",type:"land",price:100,baseRent:10,color:"#9b59b6"},
  {name:"Chance",type:"chance",color:"#f1c40f"},
  {name:"CAS",type:"land",price:140,baseRent:14,color:"#3498db"},
  {name:"Stern",type:"land",price:140,baseRent:14,color:"#3498db"},
  {name:"Steinhardt",type:"land",price:160,baseRent:16,color:"#3498db"},
  {name:"Income Tax",type:"tax",price:0,baseRent:0,color:"#bdc3c7"},
  {name:"JFK",type:"rail",price:220,baseRent:30,color:"#34495e"},
  {name:"Jail",type:"jail",color:"#e74c3c"},
  {name:"Rory Meyers",type:"land",price:180,baseRent:18,color:"#e67e22"},
  {name:"Electric Company",type:"utility",price:200,baseRent:25,color:"#95a5a6"},
  {name:"Gallatin",type:"land",price:180,baseRent:18,color:"#e67e22"},
  {name:"LGA",type:"rail",price:220,baseRent:30,color:"#34495e"},
  {name:"SPS",type:"land",price:200,baseRent:20,color:"#e67e22"},
  {name:"Courant",type:"land",price:200,baseRent:20,color:"#e67e22"},
  {name:"Community Chest",type:"chance",color:"#f1c40f"},
  {name:"Lucky Fund",type:"fund",color:"#ecf0f1"},
  {name:"Shanghai",type:"land",price:220,baseRent:22,color:"#e74c3c"},
  {name:"Chance",type:"chance",color:"#f1c40f"},
  {name:"Abu Dhabi",type:"land",price:220,baseRent:22,color:"#e74c3c"},
  {name:"Alumni Hall",type:"land",price:240,baseRent:24,color:"#e74c3c"},
  {name:"Grand Central",type:"rail",price:220,baseRent:30,color:"#34495e"},
  {name:"Carlyle Court",type:"land",price:260,baseRent:26,color:"#f39c12"},
  {name:"Go to Jail",type:"gotoJail",color:"#c0392b"},
  {name:"Ventnor Ave",type:"land",price:260,baseRent:26,color:"#f39c12"},
  {name:"Water Works",type:"utility",price:200,baseRent:25,color:"#95a5a6"},
  {name:"Marvin Gardens",type:"land",price:280,baseRent:28,color:"#f39c12"},
  {name:"EWR",type:"rail",price:220,baseRent:30,color:"#34495e"},
  {name:"Rubin Hall",type:"land",price:300,baseRent:30,color:"#27ae60"},
  {name:"Brittany Hall",type:"land",price:350,baseRent:35,color:"#27ae60"},
  {name:"Lafayette Hall",type:"land",price:320,baseRent:32,color:"#27ae60"},
  {name:"Lipton Hall",type:"land",price:320,baseRent:32,color:"#27ae60"},
  {name:"Chance",type:"chance",color:"#f1c40f"},
  {name:"Coral Tower",type:"land",price:400,baseRent:45,color:"#1f618d"},
  {name:"Paulson Hall",type:"land",price:450,baseRent:50,color:"#1f618d"}
];

// 🔥 Stable emoji list
const EMOJIS = ["🐱","🐶","🐸","🐵","🐼","🦊","🐰","🐯","🦁","🐮","🐷","🐭","🐹","🐨","🐧","🐦","🐤","🦆","🦅","🦉"];
const NORMAL_FONT = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

let players = [];
let playerCount = 2;
let current = 0;
let gameState = "WAIT";
let gameStartedAt = null;

const TILE_PER_SIDE = 10;
let tileSize = 80;
let boardSize = tileSize * TILE_PER_SIDE;
let tilePos = [];

let owner = Array(TILES.length).fill(-1);
let houseCount = Array(TILES.length).fill(0);
let skipTurns = [];
const houseMax = 4;
const buildCost = 50;
const utilityIncome = 40;
let bonusPool = 300;
const jailIndex = TILES.findIndex(tile => tile.type === "jail");

let rollBtn;
let diceBox;
let diceAnimating = false;
let diceFrame = 0;
let lastRoll = null;
let diceResultUntil = 0;

function setup() {
  fitBoardToContainer();
  const canvas = createCanvas(boardSize, boardSize);
  canvas.parent("canvas-container");
  canvas.mousePressed(clickTile);

  rollBtn = createButton('🎲 Roll Dice');
  rollBtn.parent("canvas-container");
  rollBtn.style('position','absolute');
  rollBtn.style('left','50%');
  rollBtn.style('top','50%');
  rollBtn.style('transform','translate(-50%, -50%)');
  rollBtn.size(150,64);
  rollBtn.style('font-family','"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui, sans-serif');
  rollBtn.style('font-size','20px');
  rollBtn.style('background','#e74c3c');
  rollBtn.style('color','white');
  rollBtn.style('border','none');
  rollBtn.style('border-radius','30px');
  rollBtn.style('z-index','10');
  rollBtn.hide();
  rollBtn.mousePressed(() => {
    if (gameState === "PLAY" && !diceAnimating) userRollDice();
  });

  diceBox = createDiv('');
  diceBox.parent("canvas-container");
  diceBox.style('position','absolute');
  diceBox.style('left','50%');
  diceBox.style('top','50%');
  diceBox.style('transform','translate(-50%, calc(-50% - 92px))');
  diceBox.style('min-width','190px');
  diceBox.style('padding','12px 18px');
  diceBox.style('background','rgba(255,255,255,0.94)');
  diceBox.style('border','3px solid #222');
  diceBox.style('border-radius','14px');
  diceBox.style('box-shadow','0 8px 18px rgba(0,0,0,0.18)');
  diceBox.style('text-align','center');
  diceBox.style('font-family','"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui, sans-serif');
  diceBox.style('font-size','24px');
  diceBox.style('font-weight','800');
  diceBox.style('z-index','9');
  diceBox.hide();

  initTilePositions();
  openSetup();
}

function windowResized() {
  fitBoardToContainer();
  resizeCanvas(boardSize, boardSize);
  initTilePositions();
}

function fitBoardToContainer() {
  const maxBoardSize = Math.min(900, Math.max(360, windowHeight - 30));
  tileSize = Math.floor(maxBoardSize / TILE_PER_SIDE);
  boardSize = tileSize * TILE_PER_SIDE;
}

function draw() {
  background("#ffffff");
  drawBoard();
  if (gameState === "PLAY") {
    drawPlayers();
    drawCenterInfo();
    if (frameCount % 30 === 0) updateRankingPanel();
  }
  if (!diceAnimating && lastRoll !== null && millis() > diceResultUntil) {
    diceBox.hide();
    lastRoll = null;
  }
}

function initTilePositions() {
  tilePos = [];
  for (let i = 0; i < TILE_PER_SIDE; i++) {
    tilePos.push({ x: boardSize - tileSize * (i + 1), y: boardSize - tileSize });
  }
  for (let i = 1; i < TILE_PER_SIDE; i++) {
    tilePos.push({ x: 0, y: boardSize - tileSize * (i + 1) });
  }
  for (let i = 1; i < TILE_PER_SIDE; i++) {
    tilePos.push({ x: i * tileSize, y: 0 });
  }
  for (let i = 1; i < TILE_PER_SIDE - 1; i++) {
    tilePos.push({ x: boardSize - tileSize, y: i * tileSize });
  }
}

function drawBoard() {
  textFont(NORMAL_FONT);
  for (let i = 0; i < TILES.length; i++) {
    const tile = TILES[i];
    const pos = tilePos[i];
    if (!pos) continue;
    fill(tile.color);
    stroke(0);
    rect(pos.x, pos.y, tileSize, tileSize);

    fill(0);
    textAlign(CENTER, TOP);
    textSize(12);
    text(tile.name, pos.x + tileSize / 2, pos.y + 6);
    if (tile.price > 0) {
      textSize(11);
      text(`$${tile.price}`, pos.x + tileSize / 2, pos.y + 22);
    }

    drawOwnershipBar(i, pos);
  }
}

function drawOwnershipBar(i, pos) {
  if (owner[i] === -1) return;
  const barHeight = Math.max(24, tileSize * 0.28);
  const ownerColor = players[owner[i]].color;
  fill(ownerColor);
  stroke(0);
  rect(pos.x + 3, pos.y + tileSize - barHeight - 3, tileSize - 6, barHeight, 5);

  const houseNum = houseCount[i];
  if (houseNum > 0) {
    textFont(EMOJI_FONT);
    textSize(Math.max(16, tileSize * 0.2));
    textAlign(CENTER, CENTER);
    text("🏠".repeat(houseNum), pos.x + tileSize / 2, pos.y + tileSize - barHeight / 2 - 3);
    textFont(NORMAL_FONT);
  }
}

function drawPlayers() {
  textFont(EMOJI_FONT);
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    const pos = tilePos[p.pos];
    if (!pos) continue;
    stroke(0);
    strokeWeight(2);
    fill(p.color);
    ellipse(pos.x + tileSize / 2, pos.y + tileSize / 2, Math.max(46, tileSize * 0.55), Math.max(46, tileSize * 0.55));
    noStroke();
    fill(p.color === "#ffffff" ? 0 : 255);
    textSize(Math.max(28, tileSize * 0.32));
    textAlign(CENTER, CENTER);
    text(p.emoji, pos.x + tileSize / 2, pos.y + tileSize / 2);
    strokeWeight(1);
  }
}

function drawCenterInfo() {
  if (gameState !== "PLAY") return;
  const p = players[current];
  fill(255,255,255,230);
  rect(boardSize/2-100, boardSize/2-130, 200, 60, 10);
  fill(0);
  textFont(NORMAL_FONT);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(`Current turn: ${p.emoji}`, boardSize/2, boardSize/2-105);
  textSize(14);
  fill(30,180,80);
  text(`Cash: $${p.money}`, boardSize/2, boardSize/2-80);
}

function drawDiceAnimation() {
  const diceFaces = ["⚀","⚁","⚂","⚃","⚄","⚅"];
  const face = diceFaces[diceFrame % 6];
  diceBox.html(`<div style="font-size:42px;line-height:1">${face}</div><div>Rolling...</div>`);
  diceBox.show();
}

function userRollDice() {
  if (diceAnimating) return;
  diceAnimating = true;
  rollBtn.attribute('disabled','true');
  rollBtn.html('🎲 Rolling');
  const animInterval = setInterval(()=>{
    diceFrame++;
    drawDiceAnimation();
  },80);
  setTimeout(()=>{
    clearInterval(animInterval);
    diceAnimating = false;
    const finalRoll = Math.floor(random(6))+1;
    diceFrame = finalRoll-1;
    lastRoll = finalRoll;
    diceResultUntil = millis() + 2200;
    const diceFaces = ["⚀","⚁","⚂","⚃","⚄","⚅"];
    diceBox.html(`<div style="font-size:48px;line-height:1">${diceFaces[finalRoll-1]}</div><div>Rolled ${finalRoll}</div>`);
    diceBox.show();
    rollBtn.html(`🎲 ${finalRoll}`);
    movePlayer(finalRoll);
  },800);
}

function movePlayer(steps) {
  const p = players[current];
  addHistory(`${p.emoji} rolled ${steps}`);
  let count = 0;
  const moveLoop = setInterval(()=>{
    p.pos = (p.pos+1) % TILES.length;
    if (p.pos === 0) {
      p.money += 200;
      updateRankingPanel();
      addHistory(`${p.emoji} passed GO +$200`);
    }
    count++;
    if (count >= steps) { clearInterval(moveLoop); setTimeout(onLand,300); }
  },200);
}

function onLand() {
  const p = players[current];
  const idx = p.pos;
  const tile = TILES[idx];
  addHistory(`${p.emoji} landed on  ${tile.name}`);

  if (tile.type === "go"){waitNext();return;}
  if (tile.type === "fund"){collectBonusFund();return;}
  if (tile.type ==="jail"){markSkipTurn(p,"landed on Jail");waitNext();return;}
  if (tile.type === "tax"){payTax();return;}
  if (tile.type === "gotoJail"){sendToJail(p,"Go to Jail");waitNext();return;}
  if (tile.type === "chance"){doChance();return;}
  if (owner[idx]===-1){showBuy();return;}
  if (owner[idx]===p.id){
    if(tile.type==="land" && houseCount[idx]<houseMax)showBuild();else waitNext();return;
  }
  payRent();
}

function doChance() {
  const p=players[current];
  const events=[
    {name:"Bonus",text:"Receive $200",action:()=>{p.money+=200;}},
    {name:"Fine",text:"Pay a $100 fine",action:()=>{p.money-=100;}},
    {name:"Move Forward",text:"Move forward 2 spaces",action:()=>{p.pos=(p.pos+2)%TILES.length;}},
    {name:"Move Back",text:"Move back 1 space",action:()=>{p.pos=(p.pos-1+TILES.length)%TILES.length;}},
    {name:"Go to Jail",text:"Go directly to Jail and skip the next turn",action:()=>{sendToJail(p,"Chance sent to Jail");}}
  ];
  const event=random(events);
  showMsg("Chance Card",event.text,()=>{
    event.action();
    updateRankingPanel();
    addHistory(`🎲 Chance: ${event.text}`);
    waitNext();
  });
}

function payTax() {
  const p = players[current];
  const tax = Math.min(150, p.money);
  p.money -= tax;
  bonusPool += tax;
  updateRankingPanel();
  syncOnlineStateSafe();
  showMsg("Income Tax",`Pay tax $${tax}`,waitNext);
}

function collectBonusFund() {
  const p = players[current];
  const amount = bonusPool;
  p.money += amount;
  bonusPool = 100;
  addHistory(`${p.emoji} collected Lucky Fund +$${amount}`);
  updateRankingPanel();
  syncOnlineStateSafe();
  showMsg("Lucky Fund",`Collect bonus pool $${amount}`,waitNext);
}

function markSkipTurn(player,reason) {
  skipTurns[player.id] = Math.max(skipTurns[player.id] || 0, 1);
  addHistory(`${player.emoji} ${reason}, skip next turn`);
  syncOnlineStateSafe();
}

function sendToJail(player,reason) {
  player.pos = jailIndex;
  markSkipTurn(player,reason);
}

function showBuy(){
  const idx=players[current].pos;
  const tile=TILES[idx];
  const p=players[current];
  if(p.money<tile.price){showMsg("Not Enough Cash","You cannot afford this.",waitNext);return;}
  showBtn("Buy Property",`Buy ${tile.name}?\nPrice $${tile.price}`,[
    {text:"Buy",action:()=>{
      p.money-=tile.price;
      owner[idx]=p.id;
      updateRankingPanel();
      addHistory(`${p.emoji} bought ${tile.name}`);
      syncOnlineStateSafe();
      waitNext();
    }},
    {text:"Cancel",action:waitNext}
  ]);
}

function showBuild(){
  const idx=players[current].pos;
  const p=players[current];
  if(p.money<buildCost){waitNext();return;}
  showBtn("Build House",`Cost $${buildCost}, max 4 houses`,[
    {text:"Build",action:()=>{
      p.money-=buildCost;
      houseCount[idx]++;
      updateRankingPanel();
      addHistory(`${p.emoji} built house #${houseCount[idx]}`);
      syncOnlineStateSafe();
      waitNext();
    }},
    {text:"Skip",action:waitNext}
  ]);
}

function payRent(){
  const idx=players[current].pos;
  const ownerId=owner[idx];
  const baseRent=TILES[idx].baseRent;
  const rent=Math.floor(baseRent*(1+houseCount[idx]*0.75));
  const fromPlayer=players[current];
  const toPlayer=players[ownerId];

  if(fromPlayer.money<rent){
    showMsg("Bankrupt!","You cannot pay rent.",()=>{
      players.splice(current,1);
      updateRankingPanel();
      addHistory(`${fromPlayer.emoji} went bankrupt`);
      if(players.length===1){
        finishGame(players[0]);
      }else{
        if(current>=players.length)current=0;
        waitNext();
      }
    });
    return;
  }

  fromPlayer.money-=rent;
  toPlayer.money+=rent;
  updateRankingPanel();
  addHistory(`${fromPlayer.emoji} paid $${rent} → ${toPlayer.emoji}`);
  syncOnlineStateSafe();
  waitNext();
}

function waitNext(){
  showMsg("Turn Ended","Click OK for the next player.",()=>{
    nextTurn();
  });
}

function nextTurn(){
  if(!players.length) return;
  let checked = 0;
  let foundActive = false;
  do {
    current=(current+1)%players.length;
    const p = players[current];
    if((skipTurns[p.id] || 0) > 0){
      skipTurns[p.id]--;
      addHistory(`${p.emoji} skipped this turn`);
      checked++;
      continue;
    }
    foundActive = true;
    break;
  } while(checked < players.length);
  if(!foundActive){
    current=(current+1)%players.length;
  }
  collectUtilityIncome();
  updateRankingPanel();
  addHistory(`Turn: ${players[current].emoji}`);
  rollBtn.removeAttribute('disabled');
  rollBtn.html('🎲 Roll Dice');
  syncOnlineStateSafe();
}

function collectUtilityIncome(){
  const incomeByOwner = {};
  for(let i=0;i<TILES.length;i++){
    if(TILES[i].type === "utility" && owner[i] !== -1){
      incomeByOwner[owner[i]] = (incomeByOwner[owner[i]] || 0) + utilityIncome;
    }
  }
  Object.keys(incomeByOwner).forEach(ownerId=>{
    const player = players.find(p=>p.id === Number(ownerId));
    if(!player) return;
    player.money += incomeByOwner[ownerId];
    addHistory(`${player.emoji} utility income +$${incomeByOwner[ownerId]}`);
  });
}

function clickTile(){
  if(gameState!=="PLAY")return;
  for(let i=0;i<TILES.length;i++){
    const pos=tilePos[i];
    if(mouseX>pos.x&&mouseX<pos.x+tileSize&&mouseY>pos.y&&mouseY<pos.y+tileSize){
      showTileInfo(i);break;
    }
  }
}

function showTileInfo(idx){
  const tile=TILES[idx];
  const ownerId=owner[idx];
  const rent=Math.floor((tile.baseRent || 0)*(1+houseCount[idx]*0.75));
  const ownerText=ownerId===-1?"Unowned":players[ownerId].emoji;
  const specialText = tile.type === "fund" ? `<div class="info-line">Bonus Pool: $${bonusPool}</div>` : "";

  document.getElementById("tileName").innerText=tile.name;
  document.getElementById("tileInfo").innerHTML=`
    <div class="info-line">Price: $${tile.price ?? 0}</div>
    <div class="info-line">Owner: ${ownerText}</div>
    <div class="info-line">Houses: ${houseCount[idx]}/4</div>
    <div class="info-line">Current Rent: $${rent}</div>
    ${specialText}
  `;
  showModal("tileInfoModal",true);
}

function closeTileInfo(){showModal("tileInfoModal",false);}

function showModal(id,show){
  document.getElementById(id).style.display=show?"flex":"none";
}
function showMsg(title,text,callback){
  showBtn(title,text,[{text:"OK",action:callback}]);
}
function showBtn(title,text,buttons){
  document.getElementById("modalTitle").innerText=title;
  document.getElementById("modalText").innerText=text;
  const btnBox=document.getElementById("modalBtns");
  btnBox.innerHTML="";
  buttons.forEach(b=>{
    const btn=document.createElement("button");
    btn.className="btn";
    btn.innerText=b.text;
    btn.onclick=()=>{showModal("gameModal",false);b.action();};
    btnBox.appendChild(btn);
  });
  showModal("gameModal",true);
}
function addHistory(text){
  const list=document.getElementById("historyList");
  const item=document.createElement("div");
  item.className="item";
  item.innerText=text;
  list.appendChild(item);
  list.scrollTop=list.scrollHeight;
}

function syncOnlineStateSafe(){
  if(typeof syncOnlineState === "function") syncOnlineState();
}

function updateRankingPanel(){
  const rankList = document.getElementById("rankList");
  if (!rankList) return;
  if (!players.length) {
    rankList.innerHTML = "<p>Rankings appear after the game starts.</p>";
    return;
  }
  const ranking = [...players].sort((a,b)=>b.money-a.money);
  rankList.innerHTML = ranking.map((p,idx)=>`
    <div class="rank-item ${players[current] && p.id===players[current].id ? "current" : ""}">
      <span class="rank-medal">#${idx + 1}</span>
      <span>Player  ${p.id + 1} ${p.emoji}</span>
      <span class="rank-money">$${p.money}</span>
    </div>
  `).join("");
}

function getGameStateForAI(){
  return {
    gameState,
    current,
    currentPlayer: players[current] || null,
    players: players.map(p=>({...p})),
    tiles: TILES.map((tile,idx)=>({
      ...tile,
      index: idx,
      owner: owner[idx],
      houses: houseCount[idx],
      rent: Math.floor((tile.baseRent || 0) * (1 + houseCount[idx] * 0.75))
    })),
    utilityIncome,
    buildCost,
    houseMax,
    lastRoll,
    bonusPool,
    skipTurns: [...skipTurns]
  };
}

function getSerializableGameState(){
  return {
    players,
    playerCount,
    current,
    gameState,
    owner,
    houseCount,
    skipTurns,
    bonusPool,
    gameStartedAt,
    history: Array.from(document.querySelectorAll("#historyList .item")).map(item=>item.innerText).slice(-80)
  };
}

function applySerializableGameState(state){
  if(!state) return;
  players = state.players || [];
  playerCount = state.playerCount || players.length || 2;
  current = state.current || 0;
  gameState = state.gameState || "WAIT";
  owner = state.owner || Array(TILES.length).fill(-1);
  houseCount = state.houseCount || Array(TILES.length).fill(0);
  skipTurns = state.skipTurns || [];
  bonusPool = state.bonusPool ?? 300;
  gameStartedAt = state.gameStartedAt || null;
  if(rollBtn){
    if(gameState === "PLAY") rollBtn.show();
    else rollBtn.hide();
  }
  if(Array.isArray(state.history)){
    const list=document.getElementById("historyList");
    list.innerHTML="";
    state.history.forEach(text=>{
      const item=document.createElement("div");
      item.className="item";
      item.innerText=text;
      list.appendChild(item);
    });
    list.scrollTop=list.scrollHeight;
  }
  updateRankingPanel();
}

function buildGameRecord(winner,reason){
  const ranking = [...players].sort((a,b)=>b.money-a.money);
  return {
    reason,
    winner: winner ? {id:winner.id, emoji:winner.emoji, money:winner.money} : null,
    ranking: ranking.map(p=>({id:p.id, emoji:p.emoji, money:p.money, pos:p.pos})),
    properties: owner.map((ownerId,idx)=>({idx, owner:ownerId, houses:houseCount[idx]})).filter(x=>x.owner!==-1),
    startedAt: gameStartedAt,
    endedAt: new Date().toISOString()
  };
}

function finishGame(winner){
  gameState = "END";
  rollBtn.hide();
  const record = buildGameRecord(winner,"Bankruptcy result");
  showBtn("Victory",`${winner.emoji} wins! Save this game record?`,[
    {text:"Save and Restart",action:()=>{
      if(typeof saveFinishedGameRecord === "function"){
        saveFinishedGameRecord(record).finally(()=>location.reload());
      }else{
        location.reload();
      }
    }},
    {text:"Restart Without Saving",action:()=>location.reload()}
  ]);
  syncOnlineStateSafe();
}

function openSetup(){
  gameState="SETUP";
  renderEmojiSelect();
  showModal("setupModal",true);
}
function renderEmojiSelect(){
  const count=parseInt(document.getElementById("playerCount").value);
  playerCount=count;
  const area=document.getElementById("emojiArea");
  area.innerHTML="";
  for(let i=0;i<count;i++){
    const div=document.createElement("div");
    div.innerHTML=`<p>Player  ${i+1} choose an emoji</p><div class="emoji-picker" id="pick-${i}"></div>`;
    area.appendChild(div);
    const picker=document.getElementById(`pick-${i}`);
    EMOJIS.forEach((emoji,idx)=>{
      const el=document.createElement("div");
      el.className="emoji";
      el.innerText=emoji;
      el.onclick=()=>{
        document.querySelectorAll(`#pick-${i} .emoji`).forEach(x=>x.classList.remove("selected"));
        el.classList.add("selected");
      };
      if(idx===i)el.classList.add("selected");
      picker.appendChild(el);
    });
  }
}
function startGame(){
  const selectedEmojis=[];
  for(let i=0;i<playerCount;i++){
    const sel=document.querySelector(`#pick-${i} .emoji.selected`);
    if(!sel){alert("Please choose an emoji!");return;}
    selectedEmojis.push(sel.innerText);
  }
  const colors=["#ff2d95","#00e5ff","#111111","#ffffff"];
  players=[];
  owner = Array(TILES.length).fill(-1);
  houseCount = Array(TILES.length).fill(0);
  skipTurns = Array(playerCount).fill(0);
  bonusPool = 300;
  current = 0;
  gameStartedAt = new Date().toISOString();
  for(let i=0;i<playerCount;i++){
    players.push({id:i,emoji:selectedEmojis[i],color:colors[i],money:2000,pos:0});
  }
  showModal("setupModal",false);
  gameState="PLAY";
  rollBtn.show();
  updateRankingPanel();
  addHistory("🎮 Game started!");
  syncOnlineStateSafe();
}
