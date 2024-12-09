function isBetween(num, bound1, bound2, tolerance = 0) {
  //returns true if num isBetween two bounds +/- tolerance
  if (bound1 > bound2) {
    return ((bound2 - tolerance) <= num && num <= (bound1 + tolerance));
  } else {
    return ((bound1 - tolerance) <= num && num <= (bound2 + tolerance));
  }
}





function populateMenuButtons(){
  //level select button
  menuButtons.push(new Button(width/2,height/2.5,width/5,100,"Level Select",[200,200,200]));
  menuButtons[menuButtons.length - 1].action = function(){
    screen = 2;
  }
  
  //settings
  menuButtons.push(new Button(width/2,height/1.8,width/5,100,"Settings",[200,200,200]));
  menuButtons[menuButtons.length - 1].action = function(){
    screen = 3;
  }
}



function populateLevelSelectButtons(){
  
  let w = 200;
  let h = 100;
  
  for (let i in levels){
    let newX = (100+w)*(i-4*floor(i/4)) + 50 + 250;
    let newY = (h+150)*floor(i/4)+50+50;
    levelSelectButtons.push(new Button(newX,newY,100,100,"" + (++i) + "\n\nHighscore: 0" + "\nFastest Time: 0",[200,200,200]));
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
    levelSelectButtons.push(new Button(newX,newY,100,100,"🔒",[200,200,200]));
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
      
      if (balls[i].pos.y - balls[i].radius < 50){ //bounce off top of screen if too high
        balls[i].vel.y *= (-1*balls[i].restitution);
        balls[i].pos.y += (balls[i].vel.y);
      }
      
      if (levels[currentLevel].allowBallCollisions){ //bounce balls off the other balls;
        for(let j in balls){
          if (j != i){
            balls[i].bounceBall(balls[j]);
          }
        }
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
      }
    }
    
  }
}



function menu(){
  push();
  noStroke();
  textSize(20);
  fill(200);
  rect(width/5, 75, 3*width/5,100);
  fill(0);
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
  text("settings placeholder",width/2,height/2);
}

function game(level){
  if(levels[level].ballsLeft > 0 || balls.length > 0){
    levels[level].update();
  }
  levels[level].display();
}

