/*//////////////////////
      ENTITIES
////////////////////*/

class Entity{
  constructor(type,x,y){
    this.type = type;
    this.x = x;
    this.y = y;
    if(type == "player") this.char = " >"
    else if(type == "goal"){
        this.char = " *";
        this.doCollision = function(){return this.goal();};
    } else if(type == "enemy"){
        this.char = "X";
        this.doCollision = function(){this.enemy();};
    } else if(type == "killer"){
        this.char = "&";
        this.doCollision = function(){this.kill();};
      }
  }

  goal(){
    points++;
    this.remove();
    return true;
  }

  enemy(){
    endGame();
    return true;
  }

  findPlayer(){
    if(player.x < this.x) this.x --;
    if(player.x > this.x) this.x ++;
    if(player.y < this.y) this.y --;
    if(player.y > this.y) this.y ++;

  }

  kill(){
    for (var x = 0; x < 3; x++) {
      for (var i = 0; i < entities.length; i++) {
        if(entities[i].type == "enemy"){
          entities.splice(i, 1);
          break;
        }
      }
    }
    this.remove();
    return true;
  }

  remove(){
    for (var i = 0; i < entities.length; i++) {
      if(entities[i] == this)
        entities.splice(i, 1);
    }
  }
}

var player = new Entity("player",0 , 10);
var entities = [player];

/*///////////////
    GAMEBOARD
////////////////*/

const WIDTH = 20;
const HEIGHT = 20;
var gameRunning = true;
var points = 0;

function gameboard(){
  let str = "";
  for(var y = 0; y < HEIGHT; y++){
    for(var x = 0; x < WIDTH; x++)
      str += printChars(x,y);

    str+="<br>"
  }
  $("#gameboard").html(str);
  printLabels();
  checkCollision();
}

function printChars(x,y){
  var str = "";
  for(var entity of entities){
    if(entity.x == x && entity.y == y){
      if(entity.type == "player")
        str+="(<strong>"+entity.char+"</strong>)";
      else
        str+="[<strong>" + entity.char + "</strong>]";
      return str;
    }
  }
      str+="[ &nbsp&nbsp]";
    return str;
}

function printLabels(){
  $("#points").html("Points: " + points);
}

/*////////////////////
  GAME FUNCTIONS ? START PROGRAM
//////////////////*/
var intervals = [];
var enemySpeed = 800;
startGame();

let xRand = function(){return Math.floor(Math.random() * WIDTH);};
let yRand = function(){return Math.floor(Math.random() * HEIGHT);};

function startGame(){
  points = 0;
  player.x = 0;
  player.y = 0;
  entities = [player];
  runGame();
}

function runGame(){
  intervals.push(setInterval(gameboard, 20));
  intervals.push(setInterval(spawnGoals, 2000));
  intervals.push(setInterval(spawnEmemies, 3000));
  intervals.push(setInterval(spawnKillers, 15000));
  intervals.push(setInterval(searchForPlayer, enemySpeed));
}

function endGame(){
  for(var interval of intervals)
    clearInterval(interval);
  intervals = [];
  entities = [];
  gameboard()
}

function spawnGoals(){
  let goal = new Entity("goal", xRand(), yRand());
  entities.push(goal);
}

function spawnEmemies(){
  let enemy = new Entity("enemy", xRand(), yRand());
  entities.push(enemy);
}

function spawnKillers(){
  let entity = new Entity("killer", xRand(), yRand());
  entities.push(entity);
}

function searchForPlayer(){
  for(var entity of entities){
    if(entity.type =="enemy")
      entity.findPlayer();
  }
}

function setEnemySpeed(){
  enemySpeed =  $("#enemySpeedOption").val();
}
////////////////////////
//////// Controler  ///
//////////////////////

document.addEventListener('keydown', (e) => {
  if(e.keyCode==87 && player.y > 0) checkCollision("up"); //W
  if(e.keyCode==65 && player.x > 0) checkCollision("left"); //A
  if(e.keyCode==83 && player.y < HEIGHT-1 ) checkCollision("down"); //S
  if(e.keyCode==68 && player.x < WIDTH-1) checkCollision("right"); //D
});

///////////////////
//// COLLISION ///
/////////////////

function checkCollision(direction){
  let x = player.x, y = player.y;
  var move = true;
  for(var entity of entities){
    if(entity !== player){
      if(direction == "up") if(y-1 == entity.y && x == entity.x) {
        move = entity.doCollision();
        break;
      } if(direction == "left") if(x-1 == entity.x && y == entity.y) {
        move = entity.doCollision();
        break;
      }if(direction == "down") if(y+1 == entity.y && x == entity.x) {
        move = entity.doCollision();
        break;
      }if(direction == "right") if(x+1 == entity.x && y == entity.y) {
        move = entity.doCollision();
        break;
      } if(x == entity.x && y == entity.y && entity.type =="enemy"){
        entity.doCollision();
        break;
      }
    }
  }

    if(move){
      switch (direction) {
        case "up":
          player.y--;
          player.char = " ^"
          break;
        case "left":
          player.x--;
          player.char = " <"
          break;
        case "down":
          player.y++;
          player.char = " v"
          break;
        case "right":
          player.x++;
          player.char = " >"
          break;
      }
    }
}
