class BouncePad extends Walls{
  constructor(newPos, newSize, newBounciness, newAngle = 0){
    let direction = createVector(newSize/2, 0);
    direction.rotate(newAngle);
    let point1 = p5.Vector.sub(newPos, direction);
    let point2 = p5.Vector.add(newPos, direction);
    super([new Line([point1, point2],
                    35,
                    255,
                    [150,200,150]
                   )]);
    this.bounciness = newBounciness;
    this.angle = newAngle;
    
  }
  
  display(){
    push();
    super.display();
    for (let i in this.lines){
      stroke(200,235,200,190);
      strokeWeight(this.lines[i].width + 10);
      for (let j = 0; j < this.lines[i].points.length - 1; j++ ){
        line(this.lines[j].points[j].x,this.lines[j].points[j].y,this.lines[j].points[j+1].x,this.lines[j].points[j+1].y);
      }
    }
    pop();
  }
  
  update(){
    for (let i in this.lines){
      for (let j in balls){
        if(balls[j].bounce(this.lines[i])){
          balls[j].vel.mult(1/balls[j].restitution);
          let direction = balls[j].vectToLine(this.lines[i].points[0], this.lines[i].points[1]).normalize();
          balls[j].vel.add(direction.mult(this.bounciness));
        }
      }
    }
  }
  
}