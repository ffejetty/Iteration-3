class Fan extends Obstacle{
  constructor(newPos, newSize, newStrength, newAngle = 0){
    super(newPos, newSize, newAngle, true);
    this.strength = newStrength;
    this.particles = [];
    this.length = Math.sqrt(width**2+height**2); //length of wind
    
    let halfLine = createVector(this.size/2, 0).rotate(-this.angle + PI/2);
    this.fanLine = new Line([p5.Vector.sub(this.pos, halfLine), p5.Vector.add(this.pos, halfLine)], this.size/10);
  }
  
  display(){
    push();
    
    translate(this.pos.x,this.pos.y);
    rotate(-this.angle);
    
    strokeWeight(0);
    fill(5, 212, 240, 50);
    rect(0,-this.size/2, this.length, this.size); //draw wind
    
    strokeWeight(1);
    fill(100);
    rect(0,-this.size/2,this.size/10,this.size); //draw fan
    
    fill(205, 255, 255, 150);
    strokeWeight(0);
    for(let i in this.particles){
      rect(this.particles[i].pos.x - 8, this.particles[i].pos.y - 2, 16, 4); //draw particles
    }
    
    pop();
  }
  
  update(){
    if (frameCount % 30 == 0){
      this.particles.push({pos:   createVector(24,random(-this.size/2+2,this.size/2-2)),
                           speed: random(2,4)});
    }
    
    for(let i in this.particles){
      this.particles[i].pos.x += this.particles[i].speed;
      if (this.particles[i].pos.x + 8 > this.length){
        this.particles.splice(i, 1);
        i--;
      }
    }
    
    for (let i in balls){
      if(this.inWind(balls[i])){
        this.blow(balls[i]);
      }
      balls[i].bounce(this.fanLine);
    }
    
  }
  
  inWind(ballObj){
    let translatedBall = p5.Vector.sub(ballObj.pos, this.pos);
    translatedBall.rotate(this.angle);
    
    if (isBetween(translatedBall.y, -this.size/2, this.size/2, ballObj.radius) && isBetween(translatedBall.x, 0, 1000,ballObj.radius)){
      return true;
    }
    return false;
  }
  
  blow(ballObj){
    let windVel = createVector(this.strength, 0).rotate(-this.angle)
    ballObj.vel.add(windVel);
  }
  
  
  
}