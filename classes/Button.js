class Button{
  constructor(x, y, w, h, newText = "", newColour = [255,255,255], newTextSize = 12, newTextColour = [0, 0, 0]){
    this.pos = createVector(x, y);
    this.width = w;
    this.height = h;
    this.text = newText;
    this.textSize = newTextSize;
    this.textColour = newTextColour
    this.colour = newColour;
  }
  
  action(){
    //define on initialisation
  }
  
  hovered(){
    return isBetween(mouseX,this.pos.x-this.width/2,this.pos.x+this.width/2)&&isBetween(mouseY,this.pos.y-this.height/2,this.pos.y+this.height/2)
  }
  
  checkClicked(){
    if (mouseIsPressed && this.hovered()){
      this.action();
      return true;
    }
    return false;
  }
  
  display(){
    push();
    stroke(0);
    strokeWeight(1);
    fill(0);
    if (this.hovered()){
      fill(this.colour[0]*0.9,this.colour[1]*0.9,this.colour[2]*0.9);
    }else{
      fill(this.colour[0],this.colour[1],this.colour[2]);
    }
    
    rect(this.pos.x-this.width/2,this.pos.y-this.height/2,this.width,this.height);
    
    fill(this.textColour[0], this.textColour[1], this.textColour[2]);
    strokeWeight(0);
    textSize(this.textSize);
    text(this.text,this.pos.x-this.width/2,this.pos.y,this.width);
    
    pop()
  }
  
}