(function(){

//Set up the canvas
let canvas = document.querySelector("canvas");
let drawingSurface = canvas.getContext("2d");

//What is the tile size??
const SIZE = 64;

//How many columns is the tile sheet split into?
let tileSheetColumns = 5;

//An array to set up the initial map
let map =
[
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,3],
  [3,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,3],
  [3,1,1,1,1,2,1,1,1,2,2,2,1,1,1,1,1,2,1,1,1,3],
  [3,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2,3],
  [3,1,1,2,2,2,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,3],
  [3,1,1,1,1,1,1,1,2,2,1,1,2,1,1,1,2,2,2,1,1,3],
  [3,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,3],
  [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,3],
  [3,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,2,2,1,1,1,3],
  [3,1,1,2,2,2,2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,3],
  [3,1,1,1,1,1,2,1,1,2,1,1,2,2,2,2,2,1,1,1,1,3],
  [3,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,2,2,2,1,3],
  [3,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,2,1,1,1,1,3],
  [3,1,1,2,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
];

//An array to position the game objects
let gameObjects =
[
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0],
  [0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,5,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

//Map code
const EMPTY = 0;
const FLOOR = 1;
const BOX = 2;
const WALL = 3;
const ALIEN = 4;
const BOMB = 5;

//The number of rows and columns
const ROWS = map.length;
const COLUMNS = map[0].length;

//The game states
const LOADING = 0;
const BUILD_MAP = 1;
const PLAYING = 2;
const OVER = 3;
let gameState = LOADING;

//Arrays to count the assets that need to be loaded
let assetsToLoad = [];
let assetsLoaded = 0;

//Arrays to contain game objects
let sprites = [];
let messages = [];
let boxes = [];
let bombs = [];

//Load the tile sheet
let image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "../images/timeBombPanic.png";
assetsToLoad.push(image);

//Game variables
let bombsDefused = 0;

//The game timer
gameTimer.time = 20;
gameTimer.start();

//Sprites we need to access by name
let alien = null;
let timeDisplay = null;
let gameOverDisplay = null;
let gameOverMessage = null;
let timerMessage = null;

//Arrow key codes
const UP = 38;
const DOWN = 40;
const RIGHT = 39;
const LEFT = 37;

//Directions
let moveUp = false;
let moveDown = false;
let moveRight = false;
let moveLeft = false;
let wasMovingUp = false;
let wasMovingDown = false;
let wasMovingRight = false;
let wasMovingLeft = false;

let gameWorld =
{
  x: 0,
  y: 0,
  width: map[0].length * SIZE,
  height: map.length * SIZE
};

let camera =
{
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,

  //The camera's inner scroll boundaries
  rightInnerBoundary: function()
  {
    return this.x +(this.width / 2) + (this.width /4);
  },
  leftInnerBoundary: function()
  {
    return this.x + (this.width / 2) - (this.width / 4);
  },
  topInnerBoundary: function()
  {
    return this.y + (this.height / 2) - (this.height / 4);
  },
  bottomInnerBoundary: function()
  {
    return this.y + (this.height / 2) + (this.height / 4);
  }
};

camera.x = (gameWorld.x + gameWorld.width / 2) - camera.width / 2;
camera.Y = (gameWorld.y + gameWorld.height / 2) - camera.width / 2;

//Add keyboard listeners
window.addEventListener("keydown", function(event)
{
  switch(event.keyCode)
  {
    case UP:
      moveUp = true;
      wasMovingDown = false;
      wasMovingUp = false;
      break;

    case DOWN:
      moveDown = true;
      wasMovingUp = false;
      wasMovingDown = false;
      break;

    case RIGHT:
      moveRight = true;
      wasMovingLeft = false;
      wasMovingRight = false;
      break;

    case LEFT:
      moveLeft = true;
      wasMovingRight = false;
      wasMovingLeft = false;
      break;
  }
}, false);

window.addEventListener("keyup", function(event)
{
  switch(event.keyCode)
  {
    case UP:
      moveUp = false;
      wasMovingUp = true;

      break;

    case DOWN:
      moveDown = false;
      wasMovingDown = true;

      break;

    case RIGHT:
      moveRight = false;
      wasMovingRight = true;

      break;

    case LEFT:
      moveLeft = false;
      wasMovingLeft = true;

      break;
  }
}, false);


//Start the game animation loop
update();


function loadHandler()
{
  assetsLoaded++;
  if (assetsLoaded === assetsToLoad.length)
  {
    //Remove the load event handler
    image.removeEventListener("load", loadHandler, false);

    //Build the map
    gameState = BUILD_MAP;
  }
}

function buildMap(levelMap)
{
  for(let row = 0; row < ROWS; row++)
  {
    for(let column = 0; column < COLUMNS; column++)
    {
      let currentTile = levelMap[row][column];

      if(currentTile !== EMPTY)
      {
        //Find the tiles X and Y positions on the tilesheet
        let tileSheetX = Math.floor((currentTile-1) % tileSheetColumns) * SIZE;
        let tileSheetY = Math.floor((currentTile-1) / tileSheetColumns) * SIZE;

        switch (currentTile)
        {
          case FLOOR:
            let floor = Object.create(spriteObject);
            floor.sourceX = tileSheetX;
            floor.sourceY = tileSheetY;
            floor.x = column * SIZE;
            floor.y = row * SIZE;
            sprites.push(floor);
            break;

          case BOX:
            let box = Object.create(spriteObject);
            box.sourceX = tileSheetX;
            box.sourceY = tileSheetY;
            box.x = column * SIZE;
            box.y = row * SIZE;
            sprites.push(box);
            boxes.push(box);
            break;

          case WALL:
            let wall = Object.create(spriteObject);
            wall.sourceX = tileSheetX;
            wall.sourceY = tileSheetY;
            wall.x = column * SIZE;
            wall.y = row * SIZE;
            sprites.push(wall)
            break;

          case BOMB:
            let bomb = Object.create(spriteObject);
            bomb.sourceX = tileSheetX;
            bomb.sourceY = tileSheetY;
            bomb.sourceWidth = 48;
            bomb.sourceHeight = 36;
            bomb.width = 48;
            bomb.height = 36;
            bomb.x = column * SIZE + 10;
            bomb.y = row * SIZE + 16;
            bombs.push(bomb);
            sprites.push(bomb);
            break;

          case ALIEN:
            //Alien already delcared
            alien = Object.create(spriteObject);
            alien.sourceX = tileSheetX;
            alien.sourceY = tileSheetY;
            alien.x = column * SIZE;
            alien.Y = row * SIZE;
            sprites.push(alien);
            break;
        }
      }
    }
  }
}

function createOtherObjects()
{
  timeDisplay = Object.create(spriteObject);
  timeDisplay.sourceX = 0;
  timeDisplay.sourceY = 64;
  timeDisplay.sourceWidth = 128;
  timeDisplay.sourceHeight = 48;
  timeDisplay.width = 128;
  timeDisplay.height = 48;
  timeDisplay.x = (canvas.width / 2) - (timeDisplay.width / 2);
  timeDisplay.y = 8;
  timeDisplay.scrollable = false;
  sprites.push(timeDisplay);

  gameOverDisplay = Object.create(spriteObject);
  gameOverDisplay.sourceX = 0;
  gameOverDisplay.sourceY = 129;
  gameOverDisplay.sourceWidth = 316;
  gameOverDisplay.sourceHeight = 290;
  gameOverDisplay.width = 316;
  gameOverDisplay.height = 290;
  gameOverDisplay.x = (canvas.width / 2) - (gameOverDisplay.width / 2);
  gameOverDisplay.y = (canvas.height /2) - (gameOverDisplay.height /2);
  gameOverDisplay.visible = false;
  gameOverDisplay.scrollable = false;
  sprites.push(gameOverDisplay);

  gameOverMessage = Object.create(messageObject);
  gameOverMessage.x = 275;
  gameOverMessage.y = 270;
  gameOverMessage.font = "bold 30px Helvetica";
  gameOverMessage.fillStyle = "black";
  gameOverMessage.text = "";
  gameOverMessage.visible = false;
  messages.push(gameOverMessage);

  timerMessage = Object.create(messageObject);
  timerMessage.x = 330;
  timerMessage.y = 10;
  timerMessage.font = "bold 40px Helvetica"
  timerMessage.fillStyle = "white";
  timerMessage.text = "";
  messages.push(timerMessage);
}

function update()
{
  //The animation loop
  requestAnimationFrame(update, canvas);

  //Change what the game is doing based on the game states
  switch(gameState)
  {
    case LOADING:
      console.log("loading...");
      break;

    case BUILD_MAP:
      buildMap(map);
      buildMap(gameObjects);
      createOtherObjects();
      gameState = PLAYING;
      break;

    case PLAYING:
      playGame();
      break;

    case OVER:
      endGame();
      break;
  }

  //Render the gameState
  render();
}

function playGame()
{

  let speed = 4;
  //Up
  if(moveUp && !moveDown)
  {
      alien.vy = -speed;
  }
  //Down
  if(!moveUp && moveDown)
  {
      alien.vy = speed;
  }
  //Left
  if(moveLeft && !moveRight)
  {
      alien.vx = -speed;
  }
  //Right
  if(!moveLeft && moveRight)
  {
      alien.vx = speed;
  }

  //Set the alien's velocity to zero if none of the keys are being pressed
  if(!moveLeft && !moveRight)
  {
    alien.vx = 0;
  }

  if(!moveUp && !moveDown)
  {
    alien.vy = 0;
  }

  //Align to grid
  let gridSize = 64;
  let alignSpeed = 2

  if(alien.vx === 0 || alien.vy ===0)
  {
    if(alien.x % gridSize !== 0)
    {
      if(wasMovingLeft)
      {
        alien.x -= alignSpeed;
      }
      if(wasMovingRight)
      {
        alien.x += alignSpeed;
      }
    }
    if(alien.y % gridSize !== 0)
    {
      if(wasMovingUp)
      {
        alien.y -= alignSpeed;
      }
      if(wasMovingDown)
      {
        alien.y += alignSpeed;
      }
    }
  }



  //Move the alien
  alien.x += alien.vx;
  alien.y += alien.vy;


  //Alien' screen boundaries with 64 pixel padding
  //to compensate for screen border
  // if(alien.x < 64)
  // {
  //   alien.x = 64;
  // }
  // if(alien.y < 64)
  // {
  //   alien.y = 64;
  // }
  // if(alien.x + alien.width > canvas.width - 64)
  // {
  //   alien.x = canvas.width - alien.width - 64;
  // }
  // if(alien.y + alien.height > canvas.height - 64)
  // {
  //   alien.y = canvas.height - alien.height - 64;
  // }

  //Aliens game world boundaries with 64 pixel padding to compensate
  //for the game world's border.
  alien.x = Math.max(64, Math.min(alien.x + alien.vx, gameWorld.width - alien.width - 64));
  alien.y = Math.max(64, Math.min(alien.y + alien.vy, gameWorld.height - alien.height - 64));

  //Collisions with boxes
  for(let i = 0; i < boxes.length; i++)
  {
    blockRectangle(alien, boxes[i]);
  }

  //Collisions with bombs
  for(let i = 0; i < bombs.length; i++)
  {
    let bomb = bombs[i];

    //If there's a collision make the bomb invisible,
    //Increase bombsDefused by one and checl if the player has won the game
    if(hitTestCircle(alien, bomb) && bomb.visible)
    {
      bomb.visible = false;
      bombsDefused++;
      if(bombsDefused === bombs.length)
      {
        //Change the game state to OVER if the player has defused all the bombs
        gameState = OVER;
      }
    }
  }

  //Display the gameTimer
  timerMessage.text = gameTimer.time;

  //Add a preceding 0 to the time if the time is less than 10
  if(gameTimer < 10)
  {
    timerMessage.text = "0" + gameTimer.time;
  }

  //Check to see if the game is OVER
  if(gameTimer.time === 0)
  {
    gameState = OVER;
  }

  //Scroll the camera
  if(alien.x < camera.leftInnerBoundary())
  {
    camera.x = Math.floor(alien.x - (camera.width / 4));
  }
  if(alien.y < camera.topInnerBoundary())
  {
    camera.y = Math.floor(alien.y - (camera.height /4));
  }
  if(alien.x + alien.width > camera.rightInnerBoundary())
  {
    camera.x = Math.floor(alien.x + alien.width - (camera.width / 4 * 3));
  }
  if(alien.y + alien.height > camera.bottomInnerBoundary())
  {
    camera.y = Math.floor(alien.y + alien.height - (camera.height / 4 * 3));
  }

  //The camera's gameWorld boundaries
  if(camera.x < gameWorld.x)
  {
    camera.x = gameWorld.x;
  }
  if(camera.y < gameWorld.y)
  {
    camera.y = gameWorld.y;
  }
  if(camera.x + camera.width > gameWorld.x + gameWorld.width)
  {
    camera.x = gameWorld.x + gameWorld.width - camera.width;
  }
  if(camera.y + camera.height > gameWorld.height)
  {
    camera.y = gameWorld.height - camera.height;
  }

}

function endGame()
{
  gameTimer.stop();
  gameOverDisplay.visible = true;
  gameOverMessage.visible = true;

  if(bombsDefused === bombs.length)
  {
    gameOverMessage.text = "You Won!";
  }
  else
  {
    gameOverMessage.text = "You Lost!";
  }
}

function render()
{
  //Clear the drawing surface
  drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

  //Position the gameWorld relative to the camera
  drawingSurface.save();
  drawingSurface.translate(-camera.x, -camera.y);

  //Display the sprites
  if(sprites.length !== 0)
  {
    for(let i = 0; i < sprites.length; i++)
    {
      let sprite = sprites[i];

      //Display the scrolling sprites
      if(sprite.visible && sprite.scrollable)
      {
        drawingSurface.drawImage
        (
          image,
          sprite.sourceX, sprite.sourceY,
          sprite.sourceWidth, sprite.sourceHeight,
          Math.floor(sprite.x), Math.floor(sprite.y),
          sprite.width, sprite.height
        );
      }

      //Display the non scrolling sprites
      if(sprite.visible && !sprite.scrollable)
      {
        drawingSurface.drawImage
        (
          image,
          sprite.sourceX, sprite.sourceY,
          sprite.sourceWidth, sprite.sourceHeight,
          Math.floor(camera.x + sprite.x), Math.floor(camera.y + sprite.y),
          sprite.width, sprite.height
        );
      }
    }
  }

  drawingSurface.restore();

  //Display the game messages
  if(messages.length !== 0)
  {
    for(let i = 0; i < messages.length; i++)
    {
      let message = messages[i];
      if(message.visible)
      {
        drawingSurface.font = message.font;
        drawingSurface.fillStyle = message.fillStyle;
        drawingSurface.textBaseline = message.textBaseline;
        drawingSurface.fillText(message.text, message.x, message.y);
      }
    }
  }
}

}());
