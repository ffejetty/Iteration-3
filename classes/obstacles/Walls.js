class Walls{
  constructor(newLines){
    this.lines = newLines; //array of walls in level
  }
  
  update(){
    for (let i in this.lines){
      for (let j in balls){
        balls[j].bounce(this.lines[i]);
      }
    }
  }
  
  display(){
    for (let i in this.lines){
      this.lines[i].display();
    }
  }
  
  onClick(){}
  
}