let xp = 0;
let health = 100;
let gold = 20;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick","blank","blank","blank"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
let inventorySpace1 = document.querySelector("#item1");
let inventorySpace2 = document.querySelector("#item2");
let inventorySpace3 = document.querySelector("#item3");
let inventorySpace4 = document.querySelector("#item4");
let inventorySpaces = [inventorySpace1, inventorySpace2, inventorySpace3, inventorySpace4];

const weapons = [
  { name: 'stick', power: 5 , price: 10 },
  { name: 'wood sword', power: 20 , price: 30 },
  { name: 'iron sword', power: 30 , price: 50 },
  { name: 'diamond sword', power: 60 , price: 70 },
];

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 5,
    health: 60
  },
  // {
  //   name: "ogre",
  //   level: 4,
  //   health: 80
  // },
  // {
  //   name: "dragon",
  //   level: 7,
  //   health: 300
  // },
  // {
  //   name: "goblin",
  //   level: 3,
  //   health: 40
  // },
  // {
  //   name: "orc",
  //   level: 6,
  //   health: 120
  // },
  // {
  //   name: "giant spider",
  //   level: 5,
  //   health: 90
  // },
  {
    name: "dragon",
    level: 7,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\".",
    image: "images/square.jpg",
    audio: "audio/bgm1.mp3"
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square", "Sell weapon (5 gold)"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.",
    image: "images/store.jpg",
    audio: "audio/store.mp3"
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters.",
    image: "images/cave.jpg",
    audio: "audio/cave.mp3"
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
    image: [
      "images/slime.jpg",
      "images/slime_hit.jpg", 
      "images/beast.jpg", 
      "images/beast_hit.jpg",
      "images/dragon.jpg",
      "images/dragon_hit.jpg",
      "images/miss.jpg"
    ],
    audio: "audio/battle1.mp3"
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, goTown ],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
    image: "images/win.jpg",
    audio: "audio/win.mp3"
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;",
    image: "images/lose.jpg",
    audio: "audio/lose.mp3"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;",
    image: "images/win.jpg",
    audio: "audio/win.mp3"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;
button4.onclick = sellWeapon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;

  // Actualizar el texto del botón "Buy weapon"
  if (currentWeapon < weapons.length - 1 && location.name === "store") {
    button2.innerText = `Buy weapon (${getPriceByName(weapons[currentWeapon + 1].name)} gold)`;
    button4.innerText = `Sell weapon (${getPriceByName(weapons[currentWeapon].name)/2} gold)`;
  }

  // Controlar la visibilidad de button
  if (location.name === "store" && currentWeapon === 3){
    button2.innerText = 'no more weapons';
  }

  if (location.name === "store") {
    button4.style.display = "inline-block";
  } else {
    button4.style.display = "none";
  }


  changeMusic(location.audio);
  if (location === locations[3]) {
    if (fighting === 0){
      changeImage(location.image[0]);
    } else if (fighting === 1){
      changeImage(location.image[2]);
    } else if (fighting === 2){
      changeImage(location.image[4]);
      changeMusic("audio/dragon.mp3");
    }
  } else {
    changeImage(location.image);
  }
}

function updateInventoryIcons() {
  for (let i = 0; i < inventory.length; i++) {
    let item = inventory[i];
    if (item === "blank") {
      inventorySpaces[i].src = "icon/blank.png";
    } else {
      inventorySpaces[i].src = "icon/" + item + ".png";
    }
  }
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function inventoryCount(){
  let count = 0;
  for (item of inventory) {
    if (item!== "blank") {
      count++;
    }
  }
  return count;
}

function getWeakestWeapon() {
  // Filtrar el inventario para eliminar los elementos 'blank'
  const filteredInventory = inventory.filter(item => item !== 'blank');

  // Encontrar los objetos correspondientes en el array weapons
  const weaponObjects = filteredInventory.map(item => {
    return weapons.find(weapon => weapon.name === item);
  });

  // Encontrar el objeto con menor poder
  const weakestWeapon = weaponObjects.reduce((minWeapon, currentItem) => {
    return currentItem.power < minWeapon.power ? currentItem : minWeapon;
  });
  return weakestWeapon.name;
}

function getPriceByName(weaponName) {
  const weapon = weapons.find(weapon => weapon.name === weaponName);
  if (weapon) {
    return weapon.price;
  } else {
    return null; // o podrías manejar el caso cuando no se encuentra el arma
  }
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= getPriceByName(weapons[currentWeapon + 1].name)) {
      currentWeapon++;
      gold -= getPriceByName(weapons[currentWeapon].name);
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory[currentWeapon]=newWeapon;
      if (currentWeapon < weapons.length - 1) {
        button2.innerText = `Buy weapon (${getPriceByName(weapons[currentWeapon + 1].name)} gold)`;
      } else {
        button2.innerText = 'no more weapons';
      }
      updateInventoryIcons();
      console.log(inventory);
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
  }
}

function sellWeapon() {
  if (inventoryCount() > 1) {
    gold += getPriceByName(getWeakestWeapon())/2;
    goldText.innerText = gold;
    inventory[inventory.indexOf(getWeakestWeapon())]="blank";
    text.innerText = "You sold a " + getWeakestWeapon() + ".";
    button4.innerText = `Sell weapon (${getPriceByName(weapons[currentWeapon].name)/2} gold)`;
    updateInventoryIcons();
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  if (fighting === 0) {
    changeImage(locations[3].image[1]);
  } else if (fighting === 1) {
    changeImage(locations[3].image[3]);
  } else if (fighting === 2) {
    changeImage(locations[3].image[5]);
  }
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    changeImage(locations[3].image[locations[3].image.length - 1]);
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 20;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  inventory = ["stick","blank","blank","blank"];
  updateInventoryIcons();
  goTown();
}

function changeImage(image) {
  document.getElementById("image").src = image;
}

function changeMusic(audioFile) {
  var audio = document.getElementById('background-music');
  audio.src = audioFile;
  audio.play();
}