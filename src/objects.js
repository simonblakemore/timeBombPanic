//--- The sprite object

let spriteObject =
{
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 64,
  sourceHeight: 64,
  width: 64,
  height: 64,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  visible: true,
  scrollable: true,

  //Getters
  centerX: function()
  {
    return this.x + (this.width / 2);
  },
  centerY: function()
  {
    return this.y + (this.height / 2);
  },
  halfWidth: function()
  {
    return this.width / 2;
  },
  halfHeight: function()
  {
    return this.height / 2;
  }
};

//--- The monster object
let monsterObject = Object.create(spriteObject);
monsterObject.speed = 1;

//Properties to help the monster change direction
monsterObject.NONE = 0;
monsterObject.UP = 1;
monsterObject.DOWN = 2;
monsterObject.LEFT = 3;
monsterObject.RIGHT = 4;
monsterObject.validDirections = [];
monsterObject.direction = monsterObject.NONE;
monsterObject.hunt = true;

//--- The message object

let messageObject =
{
  x: 0,
  y: 0,
  visible: true,
  text: "Message",
  font: "normal bold 20px Helvetica",
  fillStyle: "red",
  textBaseline: "top"
};

//--- The gameTimer object

let gameTimer =
{
  time: 0,
  interval: undefined,

  start: function()
  {
    let self = this;
    this.interval = setInterval(function(){self.tick();}, 1000);
  },

  tick: function ()
  {
    this.time--;
  },

  stop: function()
  {
    clearInterval(this.interval);
  },

  reset: function()
  {
    this.time = 0;
  }
};
