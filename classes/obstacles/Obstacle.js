class Obstacle{
  constructor(newPos, newSize, newAngle = 0, newCanCollide = false){
    this.pos = newPos;
    this.size = newSize;
    this.angle = newAngle;
    this.canCollide = newCanCollide;
  }

  display(){
    //define in child class
  }
  
  update(){
    //define in child class
  }
  
  onClick(){
    //define in child class
    return false;
  }
  
  //methods initialised to avoid wrong references
  
}
