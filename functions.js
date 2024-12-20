function isBetween(num, bound1, bound2, tolerance = 0) {
  //returns true if num isBetween two bounds +/- tolerance
  if (bound1 > bound2) {
    return ((bound2 - tolerance) <= num && num <= (bound1 + tolerance));
  } else {
    return ((bound1 - tolerance) <= num && num <= (bound2 + tolerance));
  }
}


function setFill(colour){
  fill(colour[0], colour[1], colour[2], colour[3]);
}

function optimiseLine(lineObj){
  for (let i = 0; i < lineObj.points.length-1;i++){ //removes duplicate points for performance
    let pointDiff = p5.Vector.sub(lineObj.points[i],
      lineObj.points[i+1]); //find vector from point at i to point at i+1
    if(pointDiff.mag()<=lineResSlider.value()){ //if points too close
      lineObj.points.splice(i,1); //remove point
      tooBunched = true;
    }
  }
}

function populateMenuButtons(){
  //level select button
  menuButtons.push(new Button(width/2,height/2.5,width/5,100,"Level Select",colourScheme.buttons));
  menuButtons[menuButtons.length - 1].action = function(){
    screen = 2;
  }
  
  //settings
  menuButtons.push(new Button(width/2,height/1.8,width/5,100,"Settings",colourScheme.buttons));
  menuButtons[menuButtons.length - 1].action = function(){
    screen = 3;
  }
}

function populateLevels(){
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
                      false)  //balls can collide
            ];
}



function populateLevelSelectButtons(){
  
  let w = 200;
  let h = 100;
  
  for (let i in levels){
    let newX = (100+w)*(i-4*floor(i/4)) + 50 + 250;
    let newY = (h+150)*floor(i/4)+50+50;
    levelSelectButtons.push(new Button(newX,newY,100,100,"" + (++i) + "\n\nHighscore: 0" + "\nFastest Time: 0",colourScheme.buttons));
    levelSelectButtons[levelSelectButtons.length - 1].action = function(){  //it works, shut up p5 idc abt semantics
      currentLevel = Number(i);
      levels[currentLevel].load();
      screen = 0;
    }
    i--;
  }
  
  for (let i = levels.length; i < 20; i++){
    let newX = (100+w)*(i-4*floor(i/4)) + 50 + 250;
    let newY = (h+150)*floor(i/4)+50+50;
    levelSelectButtons.push(new Button(newX,newY,100,100,"🔒",colourScheme.buttons));
  }
  
}


function populateLevelButtons(){
  levelButtons = [new Button(width/2-300+40,height/2-200+40,80,80,"back to level select")];
  levelButtons[0].action = function(){
    screen = 2;
  }
  
  levelButtons.push(new Button(width/2+300-40,height/2-200+40,80,80,"next level"));
  levelButtons[1].action = function(){
    currentLevel++;
    if(currentLevel < levels.length){
      if(levels[currentLevel].unlocked){
        levels[currentLevel].load();
        screen=0;
      }else{
        this.text = "🔒";
        currentLevel--;
      }
    }else{
      this.text = "no more levels!";
      currentLevel--;
    }
  }
}

function populateSettingsButtons(){
  //dyslexic fonts on/off
  settingsButtons.push(new Button(width/2, 
                                  450, 
                                  100, 
                                  100, 
                                  "Dyslexic Fonts:\nfalse", 
                                  colourScheme.buttons
                                ));

  settingsButtons[settingsButtons.length - 1].action = 
    function (){
      if(dyslexicFonts){
        textFont('Sans-Serif');
      }else{
        textFont('Comic Sans MS');
      }
      dyslexicFonts = !dyslexicFonts;
      this.text = "Dyslexic Fonts:\n" + dyslexicFonts;
    }

  //Colour buttons

  //Default Theme
  settingsButtons.push(new Button(width/2 - 500, 600, 100, 100, "Default Theme", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    colourScheme.setDefault();
  }

  //Theme 1
  settingsButtons.push(new Button(width/2 - 300, 600, 100, 100, "Theme 1", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    colourScheme.setTheme1();
  }
  //Theme 2
  settingsButtons.push(new Button(width/2 - 100, 600, 100, 100, "Theme 2", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    colourScheme.setTheme2();
  }
  //Theme 3
  settingsButtons.push(new Button(width/2 + 100, 600, 100, 100, "Theme 3", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    colourScheme.setTheme3();
  }

  //Protanopia
  settingsButtons.push(new Button(width/2 + 300, 600, 100, 100, "Colour Blind:\nProtanopia", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    colourScheme.setProtanopia();
  }

  //Tritanopia
  settingsButtons.push(new Button(width/2 + 500, 600, 100, 100, "Colour Blind:\ntritanopia", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    colourScheme.setTritanopia();
  }

  //Custom Colour Buttons

  //Apply custom theme
  settingsButtons.push(new Button(width/2 - 300, 940 , 100, 100, "Apply Custom Theme", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    colourScheme.setCustom();
  }

  //Ball Colour
  settingsButtons.push(new Button(width/2 - 75, 915 , 50, 50, "Select Ball Colour", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    customSelected = "Ball";
  }

  //Background Colour
  settingsButtons.push(new Button(width/2 - 75, 965 , 50, 50, "Select Backing Colour", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    customSelected = "Background";
  }

  //Buttons Colour
  settingsButtons.push(new Button(width/2 - 25, 915 , 50, 50, "Select Button Colour", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    customSelected = "Button";
  }

  //Spout Colour
  settingsButtons.push(new Button(width/2 - 25, 965 , 50, 50, "Select Spout Colour", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    customSelected = "Spout";
  }

  //Spout Bar Colour
  settingsButtons.push(new Button(width/2 + 25, 915 , 50, 50, "Select Ball Bar Colour", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    customSelected = "Spout Bar";
  }

  //Line Colour
  settingsButtons.push(new Button(width/2 + 25, 965 , 50, 50, "Select Line Colour", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    customSelected = "Line";
  }
  
  //Cup Colour
  settingsButtons.push(new Button(width/2 + 75, 915 , 50, 50, "Select Cup Colour", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    customSelected = "Cup";
  }

  //Text Colour
  settingsButtons.push(new Button(width/2 + 75, 965 , 50, 50, "Select Text Colour", colourScheme.buttons));
  settingsButtons[settingsButtons.length - 1].action = function (){
    customSelected = "Text";
  }

}

function handleBalls(){
  if(keyIsDown(67)){ //if c is down pause balls
    for(let i in balls){
      balls[i].display();
    }
    return false;
  }
    for (let i in balls){
      balls[i].display();
      balls[i].update();

      if (levels[currentLevel].allowBallCollisions){ //bounce balls off the other balls;
        for(let j in balls){
          if (j != i){
            balls[i].bounceBall(balls[j]);
          }
        }
      }
      
      if (balls[i].bounce(cup.sides[0]) && cup.checkInCup(balls[i])){ //check if ball touching bottom of cup
        balls.splice(i, 1); //delete ball
        i--;
        levels[currentLevel].currentScore+=100;
        continue; //go to next ball
      }
    
      if(!(balls[i].bounce(cup.sides[1]) || balls[i].bounce(cup.sides[2]))){ //if ball hasn't bounced off either side of cup
        for (let j in lines){
          if (balls[i].bounce(lines[j])){ //check if bounced off each line
            break;
          }
        }
      }
      
      if (!isBetween(balls[i].pos.x,0,width,-balls[i].radius/2)){ //bounce off side of screen if too far
        balls[i].vel.x *= (-1*balls[i].restitution);
        balls[i].pos.x += (balls[i].vel.x);
      }
      
      if (balls[i].pos.y - balls[i].radius < 100){ //bounce off top of screen if too high
        balls[i].bounce(new Line([createVector(-10, 40),
                                  createVector(width + 10, 40)
                                 ], 20));
      }
      
      
      
    
      if (balls[i].pos.y > height){ //delete ball if under screen
        balls.splice(i,1);
        i--;
      }
    }
  }

function handleLineDrawing(){
  if (mouseIsPressed){
    if(keyIsDown(88) && !creatingLine){  //if X is down
      let tempMouseBall = new Ball(mouseX, mouseY, 5); //create temp ball at mouse to check if touching a line
      for (let i in lines){
        if (tempMouseBall.bounce(lines[i])){
          levels[currentLevel].currentLineAmount += lines[i].getLength();
          lines.splice(i,1);
          i--;
          if (levels[currentLevel].currentLineAmount >= levels[currentLevel].maxLineAmount){
            levels[currentLevel].currentLineAmount = levels[currentLevel].maxLineAmount;
          }
        }
      }
    }else if (creatingLine){
      lines[lines.length-1].updateLine(createVector(mouseX,mouseY)); //add the point at mouse coord to the currently being drawn line 
      levels[currentLevel].currentLineAmount -= round(lines[lines.length-1].points[lines[lines.length-1].points.length-1].dist(lines[lines.length-1].points[lines[lines.length-1].points.length-2]))
      if (levels[currentLevel].currentLineAmount <= 0){
        creatingLine = false;
        optimiseLine(lines[lines.length-1]);
      }
    }
    
  }
}



function menu(){
  push();
  noStroke();
  textSize(20);
  fill(colourScheme.buttons[0], colourScheme.buttons[1], colourScheme.buttons[2]);
  rect(width/5, 75, 3*width/5,100);
  fill(colourScheme.text[0], colourScheme.text[1], colourScheme.text[2]);
  text("BALL DROP",width/2, 125);
  pop();
  for (let button in menuButtons){
    menuButtons[button].display();
    menuButtons[button].checkClicked();
  }
  
}



function levelSelect(){
  for (let button in levelSelectButtons){
    levelSelectButtons[button].display();
  }
}



function settings(){
  push();
  volumeSlider.show();
  outputVolume(volumeSlider.value());

  lineResSlider.show();

  customColourPicker.show();

  switch (customSelected){
    case "Ball":
        customColourScheme.balls = getColourArr(customColourPicker.color());
      break;
    case "Background":
      customColourScheme.backGround = getColourArr(customColourPicker.color());
      break;
    case "Button":
      customColourScheme.buttons = getColourArr(customColourPicker.color());
      break;
    case "Spout":
      customColourScheme.spout = getColourArr(customColourPicker.color());
      break;
    case "Spout Bar":
      customColourScheme.spoutBar = getColourArr(customColourPicker.color());
      break;
    case "Line":
      customColourScheme.lines = getColourArr(customColourPicker.color());
      break;
    case "Cup":
      customColourScheme.cup = getColourArr(customColourPicker.color());
      break;
    case "Text":
      customColourScheme.text = getColourArr(customColourPicker.color());
      break;
  }

  setFill(colourScheme.text);
  textSize(25)
  text("Volume:", width/2, 140);

  text("Line Resolution (smaller is smoother):", width/2, 290);
  drawColourExamples();

  if(customSelected != "") {
    let tempCol = JSON.parse(JSON.stringify(colourScheme))

    colourScheme.balls = customColourScheme.balls;
    colourScheme.backGround = customColourScheme.backGround;
    colourScheme.buttons = customColourScheme.buttons;
    colourScheme.spout = customColourScheme.spout;
    colourScheme.spoutBar = customColourScheme.spoutBar;
    colourScheme.lines = customColourScheme.lines;
    colourScheme.cup = customColourScheme.cup;
    colourScheme.text = customColourScheme.text;

    colourScheme.applyColours();
    
    drawColourExamples();


    colourScheme.balls = tempCol.balls;
    colourScheme.backGround = tempCol.backGround;
    colourScheme.buttons = tempCol.buttons;
    colourScheme.spout = tempCol.spout;
    colourScheme.spoutBar = tempCol.spoutBar;
    colourScheme.lines = tempCol.lines;
    colourScheme.cup = tempCol.cup;
    colourScheme.text = tempCol.text;

    colourScheme.applyColours();
  }

  for (let i in settingsButtons){
    if(settingsButtons[i].hovered() && mouseY >= 550 && mouseY <= 650){
      let tempCol = JSON.parse(JSON.stringify(colourScheme))

      settingsButtons[i].action();
      settingsButtons[i].display();
      
      drawColourExamples();


      colourScheme.balls = tempCol.balls;
      colourScheme.backGround = tempCol.backGround;
      colourScheme.buttons = tempCol.buttons;
      colourScheme.spout = tempCol.spout;
      colourScheme.spoutBar = tempCol.spoutBar;
      colourScheme.lines = tempCol.lines;
      colourScheme.cup = tempCol.cup;
      colourScheme.text = tempCol.text;

      colourScheme.applyColours();
      
    }else{
      settingsButtons[i].display();
    }
  }

  
  
  pop();
}

function getColourArr(obj){
  return [red(obj), green(obj), blue(obj)];
}

function drawColourExamples(){

  let exampTrans = createVector(0, -40);

  setFill(colourScheme.backGround);  //background
  rect(600 + exampTrans.x, 710 + exampTrans.y, 300, 200);

  //balls
  setFill(colourScheme.getBallColour(1));
  circle(650 + exampTrans.x, 790 + exampTrans.y, 10);
  setFill(colourScheme.getBallColour(0.5));
  circle(680 + exampTrans.x, 808 + exampTrans.y, 10);
  setFill(colourScheme.getBallColour(0.7));
  circle(725 + exampTrans.x, 790 + exampTrans.y, 10);
  setFill(colourScheme.getBallColour(0.4));
  circle(780 + exampTrans.x, 810 + exampTrans.y, 10);
  setFill(colourScheme.getBallColour(0.9));
  circle(815 + exampTrans.x, 860 + exampTrans.y, 10);

  //spout
  setFill(colourScheme.spout);
  rect(610 + exampTrans.x, 720 + exampTrans.y, 30, 40);

  //bar behind spout bar
  fill(255 - colourScheme.spout[0], 255 - colourScheme.spout[1], 255 - colourScheme.spout[2])
  rect(622 + exampTrans.x, 725 + exampTrans.y, 6, 30);

  //spout bar
  setFill(colourScheme.spoutBar);
  rect(622 + exampTrans.x, 740+15-(30*(0.7)) + exampTrans.y, 6, (30*(0.7))); 

  let lineTranslation = createVector(12, 20).add(exampTrans);

  //line
  let exampLine = new Line(
                           [createVector(593 + lineTranslation.x, 758 + lineTranslation.y),
                            createVector(600 + lineTranslation.x, 768 + lineTranslation.y),
                            createVector(608 + lineTranslation.x, 774 + lineTranslation.y),
                            createVector(613 + lineTranslation.x, 779 + lineTranslation.y),
                            createVector(621 + lineTranslation.x, 785 + lineTranslation.y),
                            createVector(629 + lineTranslation.x, 790 + lineTranslation.y),
                            createVector(641 + lineTranslation.x, 795 + lineTranslation.y),
                            createVector(651 + lineTranslation.x, 797 + lineTranslation.y),
                            createVector(659 + lineTranslation.x, 798 + lineTranslation.y),
                            createVector(674 + lineTranslation.x, 801 + lineTranslation.y),
                            createVector(683 + lineTranslation.x, 803 + lineTranslation.y),
                            createVector(723 + lineTranslation.x, 807 + lineTranslation.y)
                           ],
                           10,
                           255,
                           colourScheme.lines
                          );

  exampLine.display();

  //cup
  let exampCup = new Cup(810 + exampTrans.x, 850 + exampTrans.y, 40, -PI/4);

  exampCup.display();


}

function game(level){
  if(levels[level].ballsLeft > 0 || balls.length > 0){
    levels[level].update();
  }
  levels[level].display();
}

