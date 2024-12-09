class Spinner extends Obstacle{
  constructor(newPos, newSize, newSpeed){
    super(newPos, newSize, 0, true);
    this.speed = newSpeed //angular velocity in rad/s
    this.fullLine = new Line([createVector(-newSize/2,0),createVector(newSize/2,0)], 10);
  }
  display(){
    this.fullLine.display();
  }
  
  update(){
    
    this.angle += this.speed;
    
    let halfLine = createVector(this.size/2, 0);
    
    halfLine.rotate(this.angle);
    
    let point1 = p5.Vector.sub(this.pos, halfLine);
    let point2 = p5.Vector.add(this.pos, halfLine);
    
    this.fullLine.points[0] = point1;
    this.fullLine.points[1] = point2;
    
    for (let i in balls){
      if(balls[i].bounce(this.fullLine, 3)){
        
        let r = balls[i].pos.dist(this.pos); //dist from centre
        let vMag = this.speed * r;
        let vDir = balls[i].vectToLine(this.fullLine.points[0],this.fullLine.points[1]);
        vDir.normalize().mult(vMag);
        
        let ballPos = p5.Vector.sub(balls[i].pos, this.pos);
        ballPos.rotate(this.angle);
        if (ballPos.y < 0){
          balls[i].vel.add(vDir);
        }
      }
    }
    
  }
  
}