let screen;             //current game state

let menuButtons;        //array of buttons in menu
let levelSelectButtons; //array of buttons in level select
let levelButtons;       //array of buttons in level (end screen)
let settingsButtons;    //array of buttons in the settings menu

let currentLevel;       //the current level index

let fullscreenButton;   //just the button to toggle fullscreen
let mainMenuButton;     //button to return to main menu

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

let colourScheme;       //object that holds different colour schemes
let customColourScheme;
let customSelected;
let customColourPicker;

let volumeSlider;       //volume slider in settings
let lineResSlider;      //line resolution slider in settings

let dyslexicFonts;      //boolean dyslexic fonts activated or not

let motionBlurAmount = 175;//alpha value of each background, lower value will cause stronger fade effect
let ballCam = false;    //snap camera to oldest ball boolean

let backingMusic;

function preload(){
  soundFormats('mp3');
  backingMusic = loadSound("/assets/Solver");
}

function setup() {
  createCanvas(1500, 1000);

  backingMusic.play();

  lines = [];
  balls = [];
  cup = new Cup(0,0,0);
  
  colourScheme = new ColourScheme();
  customColourScheme = new ColourScheme();
  customSelected = "";

  customColourPicker = createColorPicker('#000000');
  customColourPicker.position(1000, 700);

  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.position(400, 150);
  volumeSlider.size(700);
  volumeSlider.style('accent-color:rgb(0, 0, 0)')
  volumeSlider.hide();
  lineResSlider = createSlider(5, 15, 7, 0.1);
  lineResSlider.position(400, 300);
  lineResSlider.size(700);
  lineResSlider.style('accent-color:rgb(0, 0, 0)')
  lineResSlider.hide();
  dyslexicFonts = false;
  
  screen = 1;
  displayNodes = false;
  ballsActivated = false;
  ballRate = 20;
  lineWidth = 10;
  creatingLine = false;
  menuButtons = [];
  populateMenuButtons();
  populateLevels();
  populateLevelButtons();
  levelSelectButtons = [];
  populateLevelSelectButtons();
  settingsButtons = []
  populateSettingsButtons();
  textAlign(CENTER, CENTER);
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
  if (!backingMusic.isPlaying()){
    backingMusic.play();
  }
  if(balls.length > 0 && ballCam){
    translate(width/2-balls[0].pos.x, height/2-balls[0].pos.y);
  }
  volumeSlider.hide();
  lineResSlider.hide();
  customColourPicker.hide();
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
      for(let button in settingsButtons){
        settingsButtons[button].checkClicked();
      }
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
        if(pointDiff.mag()<=lineResSlider.value()){ //if points too close
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
  }else if(key == "e"){
    colourScheme.setInverted();
  }else if(key == "z"){
    ballCam = !ballCam;
  }else if(key == "p"){
    for(let i in lines){
      console.log("Line " + (i+1) + ": ")
      for(let j in lines[i].points){
        console.log(lines[i].points[j].x + ", " + lines[i].points[j].y);
      }
    }
  }
}

