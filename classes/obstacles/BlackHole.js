class BlackHole extends Obstacle{
  constructor(newPos, newMass){
    let newSize = 2*100*newMass/(sqrt(width*width + height*height));
    super(newPos, newSize);
    this.mass = newMass;
    this.G = 100;
  }
  
  display(){
    push();
    strokeWeight(0)
    fill(0);
    circle(this.pos.x,this.pos.y,this.size*2);
    fill(130,0,170,70);
    circle(this.pos.x,this.pos.y,this.size*5);
    fill(180,0,220,20);
    circle(this.pos.x,this.pos.y,this.size*10);
    
    fill(0, 50); //equilibrium point, accel = 0
    circle(this.pos.x, this.pos.y + (levels[currentLevel].gravity/abs(levels[currentLevel].gravity))*(sqrt(abs(this.mass/(levels[currentLevel].gravity/this.G)))), 5)
    pop();
  }
  
  update(){
    for (let i in balls){
      let toHole = p5.Vector.sub(this.pos, balls[i].pos);
      toHole.normalize();
      
      let distance = this.pos.dist(balls[i].pos);
      
      let force = this.G * (this.mass / (distance*distance));
      
      toHole.mult(force);
      balls[i].vel.add(toHole);
      
      
      if (distance < this.size){
        fill(255);
        circle(this.pos.x, this.pos.y, balls[i].radius);
        balls.splice(i,1);
        i--;
      }
      
      
    }
  }
  
}