const bgMusic = document.getElementById("bgMusic");
const diceSound = document.getElementById("diceSound");
const buySound = document.getElementById("buySound");
const chanceSound = document.getElementById("chanceSound");

const players = [
  { name: "Player 1", money: 1500, pos: 0, piece: document.getElementById("p1"), houses: 0, owned: [] },
  { name: "Player 2", money: 1500, pos: 0, piece: document.getElementById("p2"), houses: 0, owned: [] }
];

const tileCount = 13;
const tileWidth = 80;
let current = 0;
const dice = document.getElementById("dice");
const statusText = document.getElementById("status");
const moneyDisplay = document.getElementById("moneyDisplay");
const rollBtn = document.getElementById("rollBtn");
const chancePopup = document.getElementById("chancePopup");
const chanceText = document.getElementById("chanceText");

const properties = [
  { name: "GO", price: 0 },
  { name: "Mediterranean", price: 60 },
  { name: "Baltic", price: 60 },
  { name: "RR", price: 200 },
  { name: "Oriental", price: 100 },
  { name: "Vermont", price: 100 },
  { name: "CHANCE", price: 0 },
  { name: "Connecticut", price: 120 },
  { name: "St. James", price: 140 },
  { name: "Virginia", price: 140 },
  { name: "CHANCE", price: 0 },
  { name: "States", price: 160 },
  { name: "JAIL", price: 0 }
];

const chanceCards = [
  "Gain $100!", "Lose $50!", "Free house!", "Move back 1", "Collect $200!", "Roll again!"
];

function playMusic() { bgMusic.play().catch(err => {}); }
function updateUI() {
  moneyDisplay.innerText = `P1: $${players[0].money} | P2: $${players[1].money}`;
  statusText.innerText = `${players[current].name}'s turn`;
}

function movePlayer(player, steps) {
  player.pos = (player.pos + steps) % tileCount;
  player.piece.style.left = `${player.pos * tileWidth + 25}px`;
  player.piece.style.top = "50px";
}

function rollDice() {
  return Math.floor(Math.random() * 5) + 1;
}

function triggerChance() {
  chanceSound.play();
  const card = chanceCards[Math.floor(Math.random() * chanceCards.length)];
  chanceText.innerText = card;
  chancePopup.style.display = "block";

  if (card.includes("Gain $100")) players[current].money += 100;
  if (card.includes("Lose $50")) players[current].money -= 50;
  if (card.includes("Collect $200")) players[current].money += 200;
  if (card.includes("Free house")) players[current].houses += 1;
}

function closeChance() {
  chancePopup.style.display = "none";
}

function buyProperty() {
  const p = players[current];
  const prop = properties[p.pos];
  if (prop.price === 0 || p.money < prop.price) return;
  if (confirm(`Buy ${prop.name} for $${prop.price}?`)) {
    buySound.play();
    p.money -= prop.price;
    p.owned.push(prop.name);
  }
}

rollBtn.addEventListener("click", () => {
  playMusic();
  diceSound.play();
  dice.classList.add("shake");

  setTimeout(() => {
    dice.classList.remove("shake");
    const steps = rollDice();
    const player = players[current];

    movePlayer(player, steps);

    if (properties[player.pos].name === "CHANCE") {
      triggerChance();
    }

    buyProperty();
    updateUI();

    if (player.money < 0) {
      statusText.innerText = `${player.name} BANKRUPT!`;
      rollBtn.disabled = true;
      return;
    }

    current = current === 0 ? 1 : 0;
    updateUI();
  }, 600);
});

updateUI();
