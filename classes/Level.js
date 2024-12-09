class Level{
  constructor(newSpoutPos, newCup, newLineAmount, newObstacles = [], newAllowBallCollisions = false, newUnlocked = false){
    this.unlocked = newUnlocked;
    this.spoutPos = newSpoutPos;
    this.cup = newCup;
    this.targetTimes = [55*60,65*60,80*60];
    this.obstacles = newObstacles;
    this.allowBallCollisions = newAllowBallCollisions;
    this.gravity = 0.1;
    
    this.maxLineAmount = newLineAmount;
    this.highscore = 0;
    this.fastestTime = 10000000;
    
    this.currentTime = 0;
    this.currentScore = 0;
    this.currentLineAmount = newLineAmount;
    this.ballsLeft = 100;
    
    this.summaryDone = false;
  }
  
  load(){
    cup = this.cup;
    lines = [];
    balls = [];
    ballsActivated = false;
    this.currentTime = 0;
    this.currentScore = 0;
    this.currentLineAmount = this.maxLineAmount;
    this.ballsLeft = 100;
    this.summaryDone = false;
    populateLevelButtons();
  }
  
  display(){
    push();
    
    for (let i in lines){
      lines[i].display();
    }
    
    for (let i in this.obstacles){
      this.obstacles[i].display();
    }
    
    cup.display();
    
    fill(0);
    rect(this.spoutPos.x-15,this.spoutPos.y-20,30,40); //draw spout
    fill(250);
    rect(this.spoutPos.x - 3, this.spoutPos.y-15, 6, 30); //draw white back of prog bar
    fill(0,250,0); 
    rect(this.spoutPos.x - 3, this.spoutPos.y+15-(30*(this.ballsLeft/100)), 6, (30*(this.ballsLeft/100))); //draw bar
    fill(0)
    text("press SHIFT to start balls",this.spoutPos.x,this.spoutPos.y-25);
    
    strokeWeight(0);
    fill(colourScheme.bar[0]*1.5, colourScheme.bar[1]*1.5, colourScheme.bar[2]*1.5);
    rect(0,0,width,50);
    
    strokeWeight(1);
    fill(colourScheme.bar[0], colourScheme.bar[1], colourScheme.bar[2]);
    rect(width/2-200,0,400,50); //top panel with info
    fill(0);
    text("time: " + this.getTimeString(this.currentTime),width/2-100,25);
    text("score: " + this.currentScore, width/2, 25);
    let lineAmount = this.currentLineAmount;
    if (lineAmount < 0){
      lineAmount = 0;
    }
    text("line: " + lineAmount, width/2 + 100, 25);
    
    if (this.ballsLeft <= 0 && balls.length == 0){
      
      if (!this.summaryDone){
        this.doSummary();
      }
      
      
      fill(235,234,216);
      rect(width/2-300,height/2-200,600,400); //back panel
      
      
      if(this.currentTime < this.targetTimes[2]){
        fill(153, 51, 0)
      }else{
        fill(0,0);
      }
      stroke(153, 51, 0);
      circle(width/2-200,height/2-50,100); //bronze medal
      
      
      if(this.currentTime < this.targetTimes[1]){
        fill(201, 198, 189)
      }else{
        fill(0,0);
      }
      stroke(201, 198, 189);
      circle(width/2+200,height/2-50,110); //silver medal
      
      
      if(this.currentTime < this.targetTimes[0]){
        fill(255, 179, 0)
      }else{
        fill(0,0);
      }
      stroke(255, 179, 0);
      circle(width/2,height/2-50,120); //gold medal
      
      
      fill(0);
      strokeWeight(0);
      text("time: " + this.getTimeString(this.currentTime),width/2-200,height/2+100);
      text("best time: " + this.getTimeString(this.fastestTime),width/2-200,height/2+150);
      text("score: " + this.currentScore, width/2, height/2+100);
      text("highscore: " + this.highscore, width/2, height/2+150);
      let lineAmount = this.currentLineAmount;
      if (lineAmount < 0){
        lineAmount = 0;
      }
      text("line: " + lineAmount, width/2 + 200, height/2+100);
      
      for (let i in levelButtons){
        levelButtons[i].display();
        levelButtons[i].checkClicked();
      }
      
    }
    
    pop();
  }
  
  
  
  update(){
    if(ballsActivated){
      this.currentTime++;
    }
    
    
    if(frameCount % ballRate == 0 && ballsActivated && this.ballsLeft > 0 && !keyIsDown(67)){ //spawn new ball every ballRate frames
      balls.push(new Ball(random(this.spoutPos.x - 10,this.spoutPos.x + 10),this.spoutPos.y,5,random(0.75,0.9)));
      this.ballsLeft--;
    }
    
    for (let i in this.obstacles){
      this.obstacles[i].update();
    }
    
    handleBalls();
    handleLineDrawing();
    
    
  }
  
  getTimeString(time){
    let timeInS = round(time/60,2);
    let justS = "" + floor(timeInS);
    let timeString = "" + timeInS;
    
    if (!(timeInS % 1)){
      timeString += ".";
    }
    
    let lenDiff = timeString.length - 1 - justS.length;
    
    if (lenDiff < 2){
      for (let i = 0; i < 2-lenDiff; i++){
        timeString += "0";
      }
    }  
    return timeString + "s";
  }
  
  doSummary(){
    
    let timeScore = 0;
    
    if(this.currentTime < this.targetTimes[0]){
      timeScore = 4000;
    }else if(this.currentTime < this.targetTimes[1]){
      timeScore = 3000;
    }else if(this.currentTime > this.targetTimes[2]){
      timeScore = 2000;
    }else{
      timeScore = floor(1000*(pow(this.targetTimes[2],3))/(pow(this.currentTime,3)));
    }
    
    let lineAmountScore = 0;
    let lineAmountUsed = this.currentLineAmount/this.maxLineAmount;
    if(lineAmountUsed >= 0.5){
      lineAmountScore = 1000
    }else if(lineAmountUsed >= 0.75){
      lineAmountScore = 500
    }
    
    this.currentScore += timeScore + lineAmountScore;
    
    if(this.currentScore > this.highscore){
      this.highscore = this.currentScore;
    }
    if(this.fastestTime > this.currentTime){
      this.fastestTime = this.currentTime;
    }
    
    if(currentLevel + 1 < levels.length){
      levels[currentLevel + 1].unlocked = true;
    }
    
    let levelNum = "" + (currentLevel + 1);
    if(this.highscore >= 15000){
      levelNum += "⭐"
    }
    
    levelSelectButtons[currentLevel].text = levelNum + "\n\nHighscore: " + this.highscore + "\nFastest Time: " + this.getTimeString(this.fastestTime);
    
    
    this.summaryDone = true;
  }
  
  
}