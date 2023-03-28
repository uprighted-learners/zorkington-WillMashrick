// Terminal readline and allows us to do input and out
const { off } = require('process');
const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
// run the program in the terminal: node index.js
// ! Do not touch code above this line.

// First defining Room Class constructor in order to build out each room.

class Room {
  constructor(name, description, locked, inventory){
  this.name = name;
  this.description = description;
  this.locked = locked;
  this.inventory = inventory;
  }
}


// Defining player as an object with an inventory property that is an array

let player = {
  inventory: []
}

// Building out rooms

let sidewalk = new Room (
"sidewalk",
"You are standing on the sidewalk outside of an office building. The door is locked, but there is a keypad to unlock it.",
true,
[]
);

let officeBuilding = new Room (
"office building", 
"You enter the office building. The entryway has marble floors and there is a large sign on the wall. You look to your right and notice a door.",
true,
["sign"]
);

let basement = new Room (
  "basement",
  "It is dusty and dark down here. In the corner you see a light reflecting off of a gold key. A couple feet away from the key, there is a crowbar propped against the wall.",
  false,
  ["key","crowbar"]
);

let park = new Room (
  "park",
  "The park is large. There are soccer fields and a baseball field. In between the sports fields, there is a grassy area. In the middle of this grassy area is a rock. \nIn the distance you can see a house to the north and an apartment building to the west.",
  false,
  ["rock"]
);

let apartmentBuilding = new Room (
  "apartment building",
  "The door is unlocked. You enter the lobby of an apartment building. No one is inside, but there is a desk with a stapler on it.",
  false,
  ["desk","stapler"]
);

let house = new Room (
  "house",
  "You unlocked the door to this empty old house. When you step inside you kick up a cloud of dust. The dust clears and you see a portal.",
  true,
  ["portal"]
);

let roomLookup = {
  sidewalk: sidewalk,
  'office building': officeBuilding,
  basement: basement,
  park: park,
  'apartment building': apartmentBuilding,
  house: house
}


// State machine for valid transitions between rooms
let roomStates = {
sidewalk: ["office building", "park"],
'office building': ["sidewalk","basement"],
basement: ["office building"],
park: ["sidewalk", "apartment building", "house"],
'apartment building': ["park"],
house: ["park"]
};

// Item Class constructor and building out of items within each room

class Item {
  constructor(name, description, canPickUp, canDrop){
    this.name = name;
    this.description = description;
    this.canPickUp = canPickUp;
    this.canDrop = canDrop;
  }

    inspectItem() {
      console.log(this.description);
    }

    pickUp() {
      if(this.canPickUp === true) {
        let item = this;
        player.inventory.push(item);
        console.log(`This ${this.name} has been added to your inventory.`)
      } else if (this.canPickUp === false) {
        console.log(`You are not able to pick up this ${this.name}.`)
      }
    }

    drop() {
      if(this.canDrop === true) {
        let item = this;
        player.inventory.pop();
        currentRoom.inventory.push(item);
        console.log(`You dropped this ${this.name}`);
      } else {
        console.log(`Cannot drop this ${this.name}. It is not part of your inventory`);
      }
    }
}

let sign = new Item (
  "sign",
  "This sign reads 'Welcome to Zork Industries!'.",
  false,
  false
);

let key = new Item (
"key",
"It is a gold key, possibly a house key. It is engraved with the initials 'SS'. Would you like to take it?",
true,
true
);

let crowbar = new Item (
"crowbar",
"This crowbar could come in handy later. Do you want to hold on to it?",
true,
true
);

let rock = new Item (
"rock",
"There is a rock in the grass in the middle of the park. Do you want to pick it up?",
true,
true
);

let stapler = new Item (
  "stapler",
  "There is a red stapler on the desk. Looks pretty fancy. Not sure if it would be much use though...",
  true,
  true
);

let desk = new Item (
  "desk",
  "This desk looks to be made out of hardwood. Built to last. Looks pretty heavy.",
  false,
  false
);

let portal = new Item (
  "portal",
  "Who knows where this portal leads...enter at your own risk!",
  false,
  false
);

let itemLookup = {
  sign: sign,
  key: key,  
  crowbar: crowbar,
  rock: rock,   
  stapler: stapler,
  desk: desk,
  portal: portal
    }

  let pickUpLookup = {
    "grab key": key,
    "pick up key": key, 
    "take key": key,

    "grab sign": sign,
    "pick up sign": sign,
    "take sign": sign,

    "grab crowbar": crowbar,
    "pick up crowbar": crowbar,
    "take crowbar": crowbar,

    "grab rock": rock,
    "pick up rock": rock,
    "take rock": rock,

    "grab stapler": stapler,
    "pick up stapler": stapler, 
    "take stapler": stapler,

    "grab desk": desk,
    "pick up desk": desk, 
    "take desk": desk,

    "grab portal": portal,
    "pick up portal": portal, 
    "take portal": portal
  }




//Function to change rooms

let currentRoom = 'sidewalk';

function changeRoom (newRoom) {
  let validChange = roomStates[currentRoom];

  if (validChange.includes(newRoom)) {
    currentRoom = newRoom;
    console.log(roomLookup[newRoom]['description']);
  }
}

// Testing: can use changeRoom function to move into all rooms.

// changeRoom('office building');
// console.log(roomLookup[currentRoom]['name']);
// changeRoom('sidewalk');
// console.log(roomLookup[currentRoom]['name']);
// changeRoom('park');
// console.log(roomLookup[currentRoom]['name']);
// changeRoom('apartment building');
// console.log(roomLookup[currentRoom]['name']);
// changeRoom('park')
// console.log(roomLookup[currentRoom]['name']);
// changeRoom('house');
// console.log(roomLookup[currentRoom]['name']);
// can't change from house to apartment building: current location still house
// changeRoom('apartment building');
// console.log(roomLookup[currentRoom]['name']);

// Game starts at Sidewalk. When correct code is entered, changeRoom function is invoked and player moves into the office building
start();

async function start() {
  const welcomeMessage =   "You are standing on the sidewalk outside of an office building. The door is locked, but there is a keypad to unlock it. The keypad has digits 0-9 and requires a five digit code. Would you like to enter a code? ";
  let answer = await ask(welcomeMessage);

  if (answer.toLowerCase() === 'yes') {
    return codeEntry();}

    else if (answer.toLowerCase() === 'no') {
      return playGame();
  }
  else {
    return start();
  }
}



    async function codeEntry() {
    answer = await ask("What code would you like to try? ");
    if (answer.includes('12345')){
      console.log("Congratulations, you unlocked the door to the office building!");
      changeRoom('office building');
    } else {
      console.log("That is the incorrect code. The door is still locked. Try again! ");
      return codeEntry();
    }
    playGame();
  }

  async function playGame() {
    let answer = await ask("What would you like to do next? ");

    if (answer === 'inventory'||
    answer === 'i') {
      for(let i of player.inventory) {
        console.log(i);
      }
      playGame();
    }

          // inventory pickup 
          if (
            answer.includes(`take`) ||
            answer.includes('pick up') ||
            answer.includes('grab') 
          ) {
          if (roomLookup[currentRoom]['inventory'].includes(
          pickUpLookup[answer].name)) {
      
              pickUpLookup[answer].pickUp();
              return playGame();
            }
          }




    // Entering Basement
    if (currentRoom === 'office building'){ 
      if (answer.includes('open door') ||
    answer.includes('go to door') 
    ) {
      console.log('The door is unlocked. On the other side of the door is a staircase. You follow the staircase and it leads you down to the basement of the building.');
      changeRoom('basement');
      playGame();
      // Testing to make sure currentRoom is updating when changeRoom is called. Working now.
      // console.log(roomLookup[currentRoom]['name']);
    }

    // Read sign in office building
    if (answer.includes('sign') ||
    answer.includes('read')) {
        console.log(sign.description);
        playGame();
      } 
    

    if (answer.includes('go outside') ||
    answer.includes('leave room') ||
    answer.includes('exit room')) {
      changeRoom('sidewalk');
      playGame();
    }
  }

    if (currentRoom === 'basement' ) {
      if (answer.includes('go upstairs') ||
      answer.includes('leave room') ||
      answer.includes('exit room')) {
        changeRoom('office building');
        playGame();
    }
  }

      // Player can enter park from sidewalk rather than try to enter office building
  if (currentRoom === 'sidewalk') {
    if (answer.includes('walk left') ||
    answer.includes('walk west') ||
    answer.includes('go west') ||
    answer.includes('go left')) {
      console.log('You walk along the sidewalk until you reach a park');
      changeRoom('park');
      playGame();
    } 
  }

    // Move from park to apartment
  if (currentRoom === 'park') {
    if (answer.includes('go west') ||
    answer.includes('go left') ||  
    answer.includes('walk west') || 
    answer.includes('walk left') ||
    answer.includes('go to apartment') ||
    answer.includes('walk to apartment') ||
    answer.includes('enter apartment')
) {
let aptWalk = "From the park, you continue west until you reach an apartment building. Would you like to go in? ";
      answer = await ask(aptWalk);
      if (answer.includes('yes')) {
        changeRoom('apartment building');
      }
      playGame()
    }


    // Move from park to house
      if (answer.includes('walk north') || 
        answer.includes('go north') ||
        answer.includes('go to house')) {
    let houseWalk = "From the park, you continue north until you reach the house. Would you like to go in? ";
          answer = await ask(houseWalk);
          if (player.inventory.includes('key')) {
            house.locked === false;
          }
        if (house.locked === false) {
          if (answer.includes('yes')) {
            console.log('You use your key to unlock the door to the house.')
            changeRoom('house');
          }
          } else {
            console.log("The house is locked. Looks like you're going to need a key...");
          playGame();
        }
      }
    }

    if (currentRoom === 'apartment building') {
      if (answer.includes('go outside') ||
      answer.includes('leave room') ||
      answer.includes('exit room')) {
        changeRoom('park');
        playGame();
    }
    }

      if (currentRoom === 'house') {
      if (answer.includes('enter portal') ||
        answer.includes('go through portal') ||
        answer.includes('go into portal')) {
          console.log('Congratulations! You won the game!!!');
          process.exit();
        }
      }
      

      else if (answer.includes('look around') ||
      answer.includes('explore')) {
      console.log(roomLookup[currentRoom]['description']);
      playGame();
    }  
    
    else {
      console.log("That is an invalid command!");
      playGame();
    }

      // while (answer !== 'exit') {
      //   answer = await ask('>_ ')
      //   playGame();
      // }
    }






  // process.exit();




