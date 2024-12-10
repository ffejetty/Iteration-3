let screen;             //current game state

let menuButtons;        //array of buttons in menu
let levelSelectButtons; //array of buttons in level select
let levelButtons;       //array of buttons in level (end screen)

let currentLevel;       //the current level

let fullscreenButton;   //just the button to toggle fullscreen
let mainMenuButton;

let levels;             //array of possible levels as level objects

let displayNodes;       //boolean, toggles displaying nodes of lines

let balls;              //array of balls spawned in current level
let lines;              //array of line in current level
let cup;                //the cup object for the current level

let ballsActivated;     //boolean, toggles balls being dropped 

let ballRate;           //rate at which balls spawn (period in frames)

let lineWidth;          //width of the players' lines

let creatingLine;       //boolean, if player is creating line or not

let comicSans;          //font otf file

let colourScheme;

let motionBlurAmount = 175;

function preload(){
  comicSans = loadFont("assets/fonts/comic_sans.otf");
}


function setup() {
  createCanvas(1500, 1000);
  
  lines = [];
  balls = [];
  cup = new Cup(0,0,0);
  
  colourScheme = new ColourScheme();
  
  screen = 1;
  displayNodes = false;
  ballsActivated = false;
  ballRate = 20;
  lineWidth = 10;
  creatingLine = false;
  menuButtons = [];
  populateMenuButtons();
  
  levels = [new Level(createVector(150, 90),            //spout pos
                      new Cup(width/2,800, 50, 0),      //cup
                      2000,                             //line amount
                      [],                               //obstacles
                      true),                            //balls can collide
            
            new Level(createVector(800, 90),            //spout pos
                      new Cup(150,800, 100, PI/4),      //cup
                      2000,                             //line amount
                      [],                               //obstacles
                      true),                            //balls can collide
            
            new Level(createVector(150, 600),           //spout pos
                      new Cup(826,300, 85, PI*(7/6)),   //cup
                      2000,                             //line amount
                      [                                 //obstacles
                        new Fan(createVector(450,950),    //fan pos
                                100,                      //fan size
                                0.21,                     //fan strength
                                PI/3                      //fan angle
                               )
                      ],
                      true),                            //balls can collide
            
            new Level(createVector(width/2,90),         //spout pos
                      new Cup(width/2,800, 50),         //cup
                      2000,                             //line amount
                      [                                 //obstacles
                        new Walls([
                                    new Line([createVector(400,500),      //wall point1
                                              createVector(width, 500)],  //wall point2
                                              20,                         //wall width
                                              200                         //wall transparency
                                            )
                        
                                 ])
                      ],
                      true),                            //balls can collide
            
            new Level(createVector(250,90),             //spout pos
                      new Cup(1250,800, 50),            //cup
                      2000,                             //line amount
                      [                                 //obstacles
                        new Spinner(createVector(250, 500),            //spinner pos
                                    200,                               //spinner length
                                    PI/20                              //spin speed 
                                   ),
                        new Walls([
                                    new Line([createVector(425,0),     //line points
                                              createVector(425,330)],
                                              20,                      //line width
                                              200                      //line transparency
                                            )
                                 ])
                      ],
                      true),                            //balls can collide
            
            new Level(createVector(150, 90),            //spout pos
                      new Cup(width/2,height-100, 100, 1*PI/3),            //cup
                      2000,                             //line amount
                      [                                 //obstacles
                        new BlackHole(createVector(width/2, height/2 + 50),
                                      150
                                     )
                      ],
                      true),                            //balls can collide
            
            new Level(createVector(150, 700),           //spout pos
                      new Cup(1250,200, 50, PI),        //cup
                      2000,                             //line amount
                      [                                 //obstacles
                        new AntiGravityButton(createVector(width/2, 900),
                                              100
                                             )
                      ],
                      true),                            //balls can collide
            
            new Level(createVector(100, 150),           //spout pos
                      new Cup(1350,200, 50, PI),        //cup
                      2000,                             //line amount
                      [                                 //obstacles
                        new Walls([
                                  new Line([createVector(300, height),
                                            createVector(300, 300)
                                           ],
                                           20,
                                           200
                                          ),
                                  new Line([createVector(600, height-300),
                                            createVector(600, 0)
                                           ],
                                           20,
                                           200
                                          ),
                                  new Line([createVector(900, height),
                                            createVector(900, 300)
                                           ],
                                           20,
                                           200
                                          ),
                                  new Line([createVector(1200, height-300),
                                            createVector(1200, 0)
                                           ],
                                           20,
                                           200
                                          )
                                 ]),
                        new BouncePad(
                                      createVector(750, height - 50),
                                      225,
                                      5
                                     ),
                        new BouncePad(
                                      createVector(1350, height - 50),
                                      225,
                                      5
                                     )
                      ],
                      false),                            //balls can collide
            new Level(createVector(150, 700),           //spout pos
                      new Cup(1350,200, 50),            //cup
                      2000,                             //line amount
                      [                                 //obstacles
                        new Walls([
                                  new Line([createVector(175, 800),
                                            createVector(900, 800)
                                           ],
                                           20,
                                           200
                                          ),
                                  new Line([createVector(175, 600),
                                            createVector(900, 600)
                                           ],
                                           20,
                                           200
                                          ),
                                  new Line([createVector(175, height),
                                            createVector(175, 300)
                                           ],
                                           20,
                                           200
                                          ),
                                  new Line([createVector(1300, height-300),
                                            createVector(1300, 0)
                                           ],
                                           20,
                                           200
                                          )
                                 ]),
                        new BouncePad(
                                      createVector(750, height - 50),
                                      225,
                                      5
                                     ),
                        new BouncePad(
                                      createVector(1350, height - 50),
                                      225,
                                      5
                                     ),
                        new AntiGravityButton(
                                              createVector(25, 75),
                                              50
                                             )
                      ],
                      false),                            //balls can collide
            
            ];
  
  populateLevelButtons();
  levelSelectButtons = [];
  populateLevelSelectButtons();
  textAlign(CENTER, CENTER);
  //textFont(comicSans);
  fullscreenButton = new Button(25,25,50,50, "⛶", [255,255,255], 30);
  fullscreenButton.action = function(){
    fullscreen(!fullscreen());
  }
  
  mainMenuButton = new Button(width-25,25,50,50, "←", [255,255,255], 30);
  mainMenuButton.action = function(){
    screen = 1;
  }
  
}

function draw() {
  background(colourScheme.backGround[0], colourScheme.backGround[1], colourScheme.backGround[2], motionBlurAmount);
  switch (screen){
    case 0:
      game(currentLevel);
      break;
    case 1:
      menu();
      break;
    case 2:
      levelSelect();
      break;
    case 3:
      settings();
      break;
    default:
      text("something went wrong",width/2,height/2);
  }
  fullscreenButton.display();
  mainMenuButton.display();
  
  //text(mouseX + ", " + mouseY,mouseX,mouseY);
  
}
function mousePressed(){
  fullscreenButton.checkClicked();
  mainMenuButton.checkClicked();
  //a case for what should happen in each screen
  switch (screen){
    case 0:
      let skipLines = false;
      for (let i in levels[currentLevel].obstacles){
        if(levels[currentLevel].obstacles[i].onClick()){
          skipLines = true;
          break;
        }
      }
      if (skipLines){
        break;
      }
      
      if ((balls.length > 0 || 
          levels[currentLevel].ballsLeft > 0) && 
          !keyIsDown(88) && 
          !fullscreenButton.hovered() && 
          levels[currentLevel].currentLineAmount > 0
         ){
        
        creatingLine = true;
        lines.push(new Line([createVector(mouseX,mouseY)],lineWidth, 255, colourScheme.lines)); //create new line to start being drawn
      }
      break;
    case 1:
      break;
    case 2:
      for (let button in levelSelectButtons){
        levelSelectButtons[button].checkClicked();
      }
      break;
    case 3:
      break;
    default:
  }
  
}

function mouseReleased(){
  if(creatingLine){
    creatingLine = false;
    let tooBunched = true;
    while(tooBunched){
      tooBunched = false;
      for (let i = 0; i < lines[lines.length-1].points.length-1;i++){ //removes duplicate points for performance
        let pointDiff = p5.Vector.sub(lines[lines.length-1].points[i],
                                      lines[lines.length-1].points[i+1]); //find vector from point at i to point at i+1
        if(pointDiff.mag()<=7){ //if points too close
          lines[lines.length-1].points.splice(i,1); //remove point
          tooBunched = true;
        }
      }
    }
  }
}

function keyPressed(){
  if (keyCode === SHIFT){
    ballsActivated = !ballsActivated;
  }else if (keyCode === ENTER){
    displayNodes = !displayNodes;
  }else if(key == "s" && screen == 0){
    while (levels[currentLevel].ballsLeft > 0){
      balls.push(new Ball(random(levels[currentLevel].spoutPos.x - 10,levels[currentLevel].spoutPos.x + 10),levels[currentLevel].spoutPos.y,5,random(0.75,0.9), createVector(0,levels[currentLevel].gravity*10)));
      levels[currentLevel].ballsLeft--;
    }
  }else if(key == "i"){
    colourScheme.setTheme3();
  }else if(key == "o"){
    colourScheme.setDefault();
  }else if(key == "u"){
    colourScheme.setTheme2();
  }else if(key == "y"){
    colourScheme.setTheme1();
  }else if(key == "t"){
    colourScheme.setProtanopia();
  }else if(key == "r"){
    colourScheme.setTritanopia();
  }
}

