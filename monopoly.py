import random
import time

# --------------------------
# Game Setup (Simple & Fancy!)
# --------------------------
print("🎮 Fancy Simple Monopoly (2 Players)")
print("-------------------------------------")

# Player Data (money, position, owned properties, houses)
players = [
    {"name": "Player 1", "money": 1500, "pos": 0, "owned": [], "houses": 0},
    {"name": "Player 2", "money": 1500, "pos": 0, "owned": [], "houses": 0}
]

# Board Properties (name, price, rent, rent_with_house)
properties = [
    {"name": "Go", "price": 0, "rent": 0, "rent_house": 0},  # No buy/rent
    {"name": "Mediterranean Ave", "price": 60, "rent": 10, "rent_house": 30},
    {"name": "Baltic Ave", "price": 60, "rent": 10, "rent_house": 30},
    {"name": "Reading RR", "price": 200, "rent": 50, "rent_house": 150},
    {"name": "Oriental Ave", "price": 100, "rent": 20, "rent_house": 60},
    {"name": "Vermont Ave", "price": 100, "rent": 20, "rent_house": 60},
    {"name": "Chance", "price": 0, "rent": 0, "rent_house": 0},  # Chance card
    {"name": "Connecticut Ave", "price": 120, "rent": 25, "rent_house": 75}
]

# Chance Cards (simple, fun effects)
chance_cards = [
    "💰 Gain $100!",
    "💸 Lose $50!",
    "🏠 Build a free house (if you own a property)!",
    "🚶 Move back 1 space",
    "🎲 Roll again!",
    "🏦 Collect $200 from the bank!"
]

# --------------------------
# Game Functions
# --------------------------
def roll_dice():
    """Roll two dice (simple: 1-6 total)"""
    return random.randint(1, 6)

def move_player(player, steps):
    """Move player around the board (loop back to Go)"""
    player["pos"] = (player["pos"] + steps) % len(properties)
    return player["pos"]

def draw_chance_card(player):
    """Draw a random chance card and apply effect"""
    card = random.choice(chance_cards)
    print(f"\n🎟️ Chance Card: {card}")
    time.sleep(1)
    
    if "Gain $100" in card:
        player["money"] += 100
    elif "Lose $50" in card:
        player["money"] -= 50
    elif "free house" in card:
        if player["owned"]:  # Only if they own a property
            player["houses"] += 1
            print(f"🏠 You got a free house! Total houses: {player['houses']}")
        else:
            print("❌ You don't own any properties — no free house!")
    elif "Move back 1 space" in card:
        player["pos"] -= 1
        print(f"🚶 Moved back to: {properties[player['pos']]['name']}")
    elif "Roll again" in card:
        print("🎲 Rolling again...")
        time.sleep(1)
        steps = roll_dice()
        print(f"You rolled {steps}!")
        move_player(player, steps)
        check_property(player)
    elif "Collect $200" in card:
        player["money"] += 200
    
    print(f"💵 {player['name']} now has ${player['money']}")

def check_property(player):
    """Check the property the player landed on (buy, pay rent, chance)"""
    current_prop = properties[player["pos"]]
    
    # Skip Go and Chance (no buy/rent)
    if current_prop["name"] == "Go":
        player["money"] += 200  # Collect $200 when passing Go
        print(f"✅ Passed Go! Collected $200. Money: ${player['money']}")
        return
    
    if current_prop["name"] == "Chance":
        draw_chance_card(player)
        return
    
    # Check if property is owned by the other player
    other_player = players[1] if player == players[0] else players[0]
    if current_prop["name"] in other_player["owned"]:
        # Pay rent (more if other player has houses)
        rent = current_prop["rent_house"] if other_player["houses"] > 0 else current_prop["rent"]
        print(f"💸 Paying rent: ${rent} to {other_player['name']}")
        player["money"] -= rent
        other_player["money"] += rent
        print(f"💵 {player['name']} now has ${player['money']}")
        return
    
    # Property is available to buy
    if current_prop["price"] > 0:
        print(f"🏠 {current_prop['name']} is for sale! Price: ${current_prop['price']}")
        if player["money"] >= current_prop["price"]:
            buy = input("Buy it? (y/n): ").lower()
            if buy == "y":
                player["money"] -= current_prop["price"]
                player["owned"].append(current_prop["name"])
                print(f"✅ Bought {current_prop['name']}! Money left: ${player['money']}")
            else:
                print("❌ Skipped buying.")
        else:
            print("❌ Not enough money to buy this property.")

def buy_house(player):
    """Let player buy a house (if they own properties and have money)"""
    if not player["owned"]:
        print("❌ You don't own any properties — can't buy a house!")
        return
    
    house_cost = 50  # Cheap, simple house cost
    if player["money"] >= house_cost:
        buy = input(f"🏠 Buy a house? Cost: ${house_cost} (increases rent!) (y/n): ").lower()
        if buy == "y":
            player["money"] -= house_cost
            player["houses"] += 1
            print(f"✅ Bought a house! Total houses: {player['houses']} | Money left: ${player['money']}")
    else:
        print("❌ Not enough money to buy a house.")

# --------------------------
# Main Game Loop
# --------------------------
while True:
    for player in players:
        # Player's Turn
        print(f"\n=====================================")
        print(f"👉 {player['name']}'s Turn | Money: ${player['money']} | Position: {properties[player['pos']]['name']}")
        input("Press Enter to roll the dice...")
        
        # Roll dice and move
        steps = roll_dice()
        print(f"🎲 You rolled a {steps}!")
        move_player(player, steps)
        print(f"🏁 Landed on: {properties[player['pos']]['name']}")
        time.sleep(1)
        
        # Check property effects
        check_property(player)
        time.sleep(1)
        
        # Option to buy a house (after landing)
        buy_house(player)
        time.sleep(1)
        
        # Check if player is bankrupt (game over)
        if player["money"] <= 0:
            other_player = players[1] if player == players[0] else players[0]
            print(f"\n🏆 GAME OVER! {player['name']} is bankrupt!")
            print(f"🎉 {other_player['name']} wins the game!")
            exit()
