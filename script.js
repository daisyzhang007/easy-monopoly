// 游戏数据
let players = [
    { name: "Player 1", money: 1500, pos: 0, owned: [], houses: 0 },
    { name: "Player 2", money: 1500, pos: 0, owned: [], houses: 0 }
];
let currentPlayer = 0;

// 棋盘属性
const properties = [
    { name: "Go", price: 0, rent: 0, rent_house: 0 },
    { name: "Mediterranean Ave", price: 60, rent: 10, rent_house: 30 },
    { name: "Baltic Ave", price: 60, rent: 10, rent_house: 30 },
    { name: "Reading RR", price: 200, rent: 50, rent_house: 150 },
    { name: "Oriental Ave", price: 100, rent: 20, rent_house: 60 },
    { name: "Vermont Ave", price: 100, rent: 20, rent_house: 60 },
    { name: "Chance", price: 0, rent: 0, rent_house: 0 },
    { name: "Connecticut Ave", price: 120, rent: 25, rent_house: 75 }
];

// 机会卡
const chanceCards = [
    "💰 Gain $100!",
    "💸 Lose $50!",
    "🏠 Build a free house (if you own a property)!",
    "🚶 Move back 1 space",
    "🎲 Roll again!",
    "🏦 Collect $200 from the bank!"
];

// DOM 元素
const gameLog = document.getElementById('game-log');
const rollBtn = document.getElementById('roll-btn');
const p1Money = document.getElementById('p1-money');
const p2Money = document.getElementById('p2-money');
const p1Pos = document.getElementById('p1-pos');
const p2Pos = document.getElementById('p2-pos');

// 工具函数
function addLog(text) {
    const p = document.createElement('p');
    p.textContent = text;
    gameLog.appendChild(p);
    gameLog.scrollTop = gameLog.scrollHeight;
}

function updateUI() {
    p1Money.textContent = players[0].money;
    p2Money.textContent = players[1].money;
    p1Pos.textContent = properties[players[0].pos].name;
    p2Pos.textContent = properties[players[1].pos].name;
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function movePlayer(player, steps) {
    player.pos = (player.pos + steps) % properties.length;
    // 经过 Go 加钱
    if (player.pos < steps) {
        player.money += 200;
        addLog(`✅ Passed Go! Collected $200.`);
    }
}

function drawChanceCard(player) {
    const card = chanceCards[Math.floor(Math.random() * chanceCards.length)];
    addLog(`🎟️ Chance Card: ${card}`);
    
    if (card.includes("Gain $100")) player.money += 100;
    else if (card.includes("Lose $50")) player.money -= 50;
    else if (card.includes("free house")) {
        if (player.owned.length > 0) {
            player.houses += 1;
            addLog(`🏠 You got a free house! Total houses: ${player.houses}`);
        } else {
            addLog("❌ You don't own any properties — no free house!");
        }
    } else if (card.includes("Move back 1 space")) {
        player.pos = Math.max(0, player.pos - 1);
        addLog(`🚶 Moved back to: ${properties[player.pos].name}`);
    } else if (card.includes("Roll again")) {
        addLog("🎲 Rolling again...");
        const steps = rollDice();
        addLog(`You rolled ${steps}!`);
        movePlayer(player, steps);
        checkProperty(player);
    } else if (card.includes("Collect $200")) player.money += 200;
    
    addLog(`💵 ${player.name} now has $${player.money}`);
}

function checkProperty(player) {
    const prop = properties[player.pos];
    if (prop.name === "Go") return;
    if (prop.name === "Chance") {
        drawChanceCard(player);
        return;
    }

    const otherPlayer = currentPlayer === 0 ? players[1] : players[0];
    if (prop.name in otherPlayer.owned) {
        const rent = otherPlayer.houses > 0 ? prop.rent_house : prop.rent;
        addLog(`💸 Paying rent: $${rent} to ${otherPlayer.name}`);
        player.money -= rent;
        otherPlayer.money += rent;
        addLog(`💵 ${player.name} now has $${player.money}`);
        return;
    }

    if (prop.price > 0) {
        addLog(`🏠 ${prop.name} is for sale! Price: $${prop.price}`);
        if (player.money >= prop.price) {
            if (confirm(`Buy ${prop.name} for $${prop.price}?`)) {
                player.money -= prop.price;
                player.owned.push(prop.name);
                addLog(`✅ Bought ${prop.name}! Money left: $${player.money}`);
            } else {
                addLog("❌ Skipped buying.");
            }
        } else {
            addLog("❌ Not enough money to buy this property.");
        }
    }
}

function buyHouse(player) {
    if (player.owned.length === 0) {
        addLog("❌ You don't own any properties — can't buy a house!");
        return;
    }
    if (confirm(`🏠 Buy a house for $50? (Increases rent!)`)) {
        if (player.money >= 50) {
            player.money -= 50;
            player.houses += 1;
            addLog(`✅ Bought a house! Total houses: ${player.houses} | Money left: $${player.money}`);
        } else {
            addLog("❌ Not enough money to buy a house.");
        }
    }
}

// 游戏主循环
rollBtn.addEventListener('click', () => {
    const player = players[currentPlayer];
    addLog(`\n👉 ${player.name}'s Turn`);
    
    const steps = rollDice();
    addLog(`🎲 You rolled a ${steps}!`);
    movePlayer(player, steps);
    addLog(`🏁 Landed on: ${properties[player.pos].name}`);
    
    checkProperty(player);
    buyHouse(player);
    updateUI();

    // 检查破产
    if (player.money <= 0) {
        const winner = currentPlayer === 0 ? players[1] : players[0];
        addLog(`\n🏆 GAME OVER! ${player.name} is bankrupt!`);
        addLog(`🎉 ${winner.name} wins the game!`);
        rollBtn.disabled = true;
        return;
    }

    // 切换玩家
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    rollBtn.textContent = `Roll Dice (${players[currentPlayer].name})`;
});

// 初始化
updateUI();
addLog("🎮 Game started! Press the button to roll the dice.");
