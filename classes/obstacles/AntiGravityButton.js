class AntiGravityButton extends Obstacle{
  constructor(newPos, newSize){
    super(newPos, newSize);
    this.button = new Button(this.pos.x,this.pos.y,this.size,this.size, "↓", [255,240,255], 20);
    this.button.action = function(){ 
        levels[currentLevel].gravity *= -1;
        for (let i in balls){
          balls[i].accel.y = levels[currentLevel].gravity;
        }
        switch (abs(levels[currentLevel].gravity)/levels[currentLevel].gravity){
          case -1:
            this.text = "↑";
            break;
          case 1:
            this.text = "↓";
            break;
          default:
            this.text = "something went wrong";
      }
    }
    
    this.sides = new Line([],0);
    this.makeSides();
  }
  
  display(){
    this.button.display();
  }
  
  update(){
    for (let i in balls){
      balls[i].bounce(this.sides);
    }
  }
  
  onClick(){
    return this.button.checkClicked();
  }
  
  makeSides(){
    let diagonal = createVector(this.button.width/2, this.button.height/2);
    let perpDiagonal = p5.Vector.rotate(diagonal, -PI/2);
    
    let topLeft = p5.Vector.sub(this.pos, diagonal);
    let bottomLeft = p5.Vector.sub(this.pos, perpDiagonal);
    let topRight = p5.Vector.add(this.pos, perpDiagonal);
    let bottomRight = p5.Vector.add(this.pos, diagonal);
    
    this.sides = new Line([bottomLeft, topLeft, topRight, bottomRight, bottomLeft], 10);
    
  }
  
}