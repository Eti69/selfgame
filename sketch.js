const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;


var spikeblockGroup;
var engine, world;
var health=100;

var bg;

var block, blockImg, blocksGroup;
var person, jumpImg,walkImg,standImg;
var bgimage;
var ground;
var invisblock;
var invisGroup;
var spike, spikeImg, spike2Img, spikeblock;
var playerCount; 

var gameState=0;
function preload(){
  bgimage=loadImage('./mariobkgrnd.jpg')
  blockImg=loadImage('./obstacles.png')

  runImg=loadAnimation("imgs/Run__000.png","imgs/Run__001.png","imgs/Run__002.png","imgs/Run__003.png","imgs/Run__004.png","imgs/Run__005.png","imgs/Run__006.png","imgs/Run__007.png","imgs/Run__008.png","imgs/Run__009.png")
  standImg=loadAnimation("imgs/Idle__000.png");
  jumpImg = loadAnimation("/imgs/Jump__000.png","/imgs/Jump__001.png", "/imgs/Jump__002.png")

  spikeImg=loadImage("imgs/Spike1.png");
  spike2Img=loadImage("imgs/Spike2.png");
}

function setup(){

createCanvas(displayWidth,displayHeight)

engine=Engine.create();
world = engine.world;

bg=createSprite(1000,150,400,200);
bg.addImage(bgimage)
bg.scale=1.5;
blocksGroup= new Group();
invisGroup= new Group();
spikeblockGroup= new Group();

person=createSprite(70,850,20,20)
person.scale=0.4;
person.addAnimation("jump", jumpImg);
person.addAnimation("run",runImg);
person.addAnimation("stand", standImg);


person.setCollider("circle",0,0,200)
person.debug=true;

ground=createSprite(displayWidth-950,displayHeight-150,displayWidth,20);
ground.visible=false;
}




function draw(){
Engine.update(engine);

background('blue');
if(gameState===0){
  bg.velocityX=-3;

  person.collide(ground);

  if(bg.x<0){
  bg.x=300;
  }

  if(keyDown("space")&&person.y>=500){
    person.changeAnimation("jump", jumpImg);
    person.velocityX=3;  
    person.velocityY=-10;

  }

  if(keyDown("d")){
    person.changeAnimation("run",runImg);
    person.velocityX=3;    
  }

  person.velocityY=person.velocityY+0.8;
  if(keyDown("a")){
    person.velocityX=-3;
  }

  if(person.velocityX===bg.velocityX){
    person.addAnimation("stand",standImg);
  }
  else{
    person.addAnimation("run",runImg);
  
  
  }
  //person.collide(blocksGroup);
 
  if(invisGroup.isTouching(person)){    
    person.velocityY=0;
  }
  
  if(blocksGroup.isTouching(person) && keyDown("space")){
    person.changeAnimation("jump", jumpImg);    
    person.velocityY = -10;
  }

  if(person.isTouching(spikeblockGroup)){
   if(health>=0){
    health=health-1;
   }
   else if(health<0){
     gameState=1;
   }
  } 
  
  text("Health: "+health,950,500)
  spawnSpikes();
  spawnBlocks();
  drawSprites();
  

  if(gameState===1){
  text("GAME OVER",200,200);
  }

}


function spawnBlocks(){
    if(frameCount%100===0){
        block=createSprite(displayWidth,Math.round(random(displayHeight-500,displayHeight-200)),100,20);
        block.addImage(blockImg);
        block.scale=0.2;
        block.velocityX=bg.velocityX;
        block.lifetime=1080;
        person.collide(block);
        block.setCollider("rectangle",10,20,100,40)
        block.debug=true;
        block.depth=person.depth;
        person.depth+=1;

           
        invisblock=createSprite(200,15);
        invisblock.x=block.x;
        invisblock.y=block.y-30;
        invisblock.width=150;
        invisblock.height=20;
        invisblock.x=block.x;
        invisblock.velocityX=block.velocityX;
        invisblock.visible=false;
      
        blocksGroup.add(block);
        invisGroup.add(invisblock)
    }
}



function spawnSpikes(){
  if(frameCount%100===0){
    spike=createSprite(random(displayWidth-900,displayWidth-200),displayHeight-200,100,20); 
    var rand=Math.round(random(1,2));
    switch(rand){
      case 1: spike.addImage(spikeImg);
              spike.scale=0.3;
              break;
      case 2: spike.addImage(spike2Img);
              spike.scale=0.3;
              break;
      default: break;
    }

    spike.velocityX=bg.velocityX;

    spikeblock=createSprite(spike.x, spike.y, 100, 20);
    spikeblock.velocityX=bg.velocityX;

    console.log(health);
    spikeblock.debug=true;
    spikeblockGroup.add(spikeblock);
    spikeblockGroup.setCollider

  }
}
}



function getPlayers(){
  var playerRef=database.ref("players");
  playerRef.on("value",(data)=>{
    playerCount=data.val();
  })
}

function updatePlayers(count){
  database.ref("players").update({
    players:count
  })
}