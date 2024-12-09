class ColourScheme{
  constructor(){
    this.balls = [255, 50, 50];
    this.backGround = [250, 250, 250];
    this.buttons = [200, 200, 200];
    this.lines = [0,0,0];
    this.bar = [250, 221, 155];
    this.cup = [30, 217, 217];
  }
  
  getBallColour(nBrightness){
    let finalColour = [];
    for (let i in this.balls){
      finalColour.push(this.balls[i]*nBrightness);
    }
    return finalColour;
  }
  
}