class Ball{
  constructor(newX,newY,newRadius, newE = 1, startVel = createVector(0,0)){
    this.pos = createVector(newX,newY);
    this.vel = startVel;
    this.accel = createVector(0,levels[currentLevel].gravity);
    this.radius = newRadius;
    this.restitution = newE;
    this.ballBrightness = ((this.restitution-0.75)/0.15); //brightness as a % based on bounciness (darker balls are less bouncy)
  }
  
  update(){
    if(this.vel.mag() < 10){
      this.vel.add(this.accel);
    }
    this.pos.add(this.vel);
  }
  
  display(){
    push();
    //strokeWeight(0);
    let ballColour = colourScheme.getBallColour(this.ballBrightness);
    fill(ballColour[0], ballColour[1], ballColour[2]);
    circle(this.pos.x,this.pos.y,this.radius*2);
    pop();
  }
  
  distToLine(p1, p2){
    return this.vectToLine(p1, p2).mag();
  }
  
  vectToLine(p1, p2){
    let lineDirection = createVector(p2.x-p1.x,p2.y-p1.y); //direction vector for line equation
    let lambda = (lineDirection.x*(this.pos.x-p1.x)+lineDirection.y*(this.pos.y-p1.y))/(Math.pow(lineDirection.mag(),2)); //multiple of direction in line equation for point perpendicular to ball on line
    let lineToBall = createVector(this.pos.x-p1.x-lambda*lineDirection.x,this.pos.y-p1.y-lambda*lineDirection.y);//perpendicular vector from line to ball
    return lineToBall;
  }
  
  touchingSegment(p1, p2, lineWidth){
    let distance = this.distToLine(p1, p2);
    let inRange = (isBetween(this.pos.x,p1.x,p2.x,lineWidth/2+this.radius))&&
                  (isBetween(this.pos.y,p1.y,p2.y,lineWidth/2+this.radius));
    let touchingLine = distance <= lineWidth/2+this.radius;
    return touchingLine && inRange;
  }
  
  snapToLine(lineObj, segmentI, offset = 0){
    let toLine = this.vectToLine(
                                  lineObj.points[segmentI],
                                  lineObj.points[segmentI+1]);
    //let distToLine = p5.Vector.mult(toLine, 1);
        
    let overlap = toLine.mag() - this.radius - lineObj.width/2;
        
    toLine.normalize();
    toLine.mult(overlap - offset);
    
        
    this.pos.add(toLine);
        
    if(this.touchingSegment(
                        lineObj.points[segmentI],
                        lineObj.points[segmentI+1],
                        lineObj.width)){
      
      this.pos.sub(toLine.mult(2));
    }
    
    //tries to figure out which side of the line the ball was the frame before so it knows which side to snap the ball to
    //doesn't work
    /*
    
    let midPoint = p5.Vector.add(lineObj.points[segmentI], lineObj.points[segmentI+1]).mult(0.5);
    let angle = atan((lineObj.points[segmentI].y-lineObj.points[segmentI+1].y)/(lineObj.points[segmentI].x-lineObj.points[segmentI+1].x));

    
    let before = p5.Vector.sub(p5.Vector.sub(this.pos, this.vel), midPoint).rotate(angle);
    let after = p5.Vector.sub(this.pos, midPoint).rotate(angle);
    
    if(before.y < 0){
      if(after.y < 0){
        this.pos.add(toLine);
        
        if(this.touchingSegment(
                              lineObj.points[segmentI],
                              lineObj.points[segmentI+1],
                              lineObj.width)){
          this.pos.sub(toLine.mult(2));
        }
      }else{
        console.log("e")
        this.pos.add(distToLine)
        toLine.normalize()
        toLine.mult(this.radius + lineObj.width/2);
      }
    }else{
      if(after.y > 0){
        this.pos.add(toLine);
        
        if(this.touchingSegment(
                              lineObj.points[segmentI],
                              lineObj.points[segmentI+1],
                              lineObj.width)){
          this.pos.sub(toLine.mult(2));
        }
      }else{
        console.log("a")
        this.pos.add(distToLine)
        toLine.normalize()
        toLine.mult(this.radius + lineObj.width/2);
      }
    }
    */
    
  }
  
  
  bounce(lineObj, offset = 0){ //attempt to bounce ball off a line. return true if succesful (if ball was touching line)
    for (let i = 0; i < lineObj.points.length-1;i++){
      if(this.touchingSegment(
                              lineObj.points[i],
                              lineObj.points[i+1],
                              lineObj.width)){
        
        /*
        if(this.pos.dist(lineObj.points[i]) <= this.radius + lineObj.width/2){
          this.bounceBall(new Ball(lineObj.points[i].x,lineObj.points[i].y,this.radius))
          return true;
        }else if(this.pos.dist(lineObj.points[i + 1]) <= this.radius + lineObj.width/2){
          this.bounceBall(new Ball(lineObj.points[i + 1].x,lineObj.points[i + 1].y,this.radius))
          return true;
        }*/
        
        let lineDirection = createVector(lineObj.points[i].x - lineObj.points[i+1].x, lineObj.points[i].y - lineObj.points[i+1].y); //turn line into a vector
        
        this.snapToLine(lineObj, i, offset); //more than doubles calculations per ball but eliminates balls getting stuck in lines. could be made more efficient but would require slight rework of current methods

        this.vel.reflect(lineDirection).mult(-1); //reflect ball vel in the line
        
        //this.pos.add(createVector(this.vel.x,this.vel.y).normalize().mult(1.5)); //go forward 1 in vel direction to avoid getting stuck (old method)
        
                
        
        this.vel.mult(this.restitution); //decrease speed based on bounciness
        
        if (this.vel.mag() < 1){ //move ball down line
          let downLine = this.vectToLine(lineObj.points[i], lineObj.points[i+1]).rotate(PI/2).normalize();
          if(round(downLine.y,2) == 0){
            return true;
          }
          if (downLine.y * levels[currentLevel].gravity < 0){
            downLine.rotate(PI);
          }
          this.vel.add(downLine);
        }
        
        return true;
      }
    }
    return false; 
  }
  
  bounceBall(ballObj){
    if (ballObj === this){
      return false;
    }
    if(this.pos.dist(ballObj.pos) < this.radius + ballObj.radius){
      
      let avgRestitution = (this.restitution + ballObj.restitution)/2;
      
      let ballToBall = p5.Vector.sub(this.pos,ballObj.pos);
      
      let thisVelMag = this.vel.mag();
      let ballVelMag = ballObj.vel.mag();
      
      let thisNudge = ballObj.vel
      let ballNudge = this.vel
      
      let nudge = p5.Vector.add(this.vel,ballObj.vel).mult(0.5);
      
      thisNudge.mult(1/avgRestitution);
      ballNudge.mult(1/avgRestitution);
      
      this.vel.add(ballToBall)
      this.vel.add(thisNudge);
      this.vel.normalize();
      this.vel.mult(thisVelMag);
      this.vel.mult(avgRestitution);
      
      ballObj.vel.sub(ballToBall)
      ballObj.vel.add(ballNudge);
      ballObj.vel.normalize();
      ballObj.vel.mult(ballVelMag);
      ballObj.vel.mult(avgRestitution);
      
      let overlap = this.radius + ballObj.radius - ballToBall.mag();
      ballToBall.normalize();
      ballToBall.mult(overlap/2);
      this.pos.add(ballToBall);
      ballObj.pos.sub(ballToBall);
      
      return true;
    }
    return false;
  }
  
}