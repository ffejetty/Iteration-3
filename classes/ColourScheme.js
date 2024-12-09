class ColourScheme{
  constructor(){
    this.balls = [255, 50, 50];
    this.backGround = [250, 250, 250];
    this.buttons = [200, 200, 200];
    this.spout = [0, 0, 0];
    this.spoutBar = [0, 250, 0];
    this.lines = [0, 0, 0];
    this.cup = [30, 217, 217];
    this.text = [0, 0, 0];
  }
  
  getBallColour(nBrightness){
    let finalColour = [];
    for (let i in this.balls){
      finalColour.push(this.balls[i]*nBrightness);
    }
    return finalColour;
  }

  applyColour(arr, colour){  //applies the inputted colour to each object in inputted array
    for(let i in arr){
      arr[i].colour = colour;
    }
  }

  applyTextColour(arr, colour){
    for(let i in arr){
      arr[i].textColour = colour;
    }
  }

  applyColours(){

    this.applyColour(lines, this.lines);

    this.applyColour(menuButtons, this.buttons);
    this.applyTextColour(menuButtons, this.text); 

    this.applyColour(levelSelectButtons, this.buttons);
    this.applyTextColour(levelSelectButtons, this.text);

  }

  setDefault(){
    this.balls = [255, 50, 50];
    this.backGround = [250, 250, 250];
    this.buttons = [200, 200, 200];
    this.spout = [0, 0, 0];
    this.spoutBar = [0, 250, 0];
    this.lines = [0, 0, 0];
    this.cup = [30, 217, 217];
    this.text = [0, 0, 0];

    this.applyColours();

  }

  setInverted(){
    this.balls = [255 - 255, 255 - 50, 255 - 50];
    this.backGround = [255 - 250, 255 - 250, 255 - 250];
    this.buttons = [255 - 200, 255 - 200, 255 - 200];
    this.spout = [255 - 0, 255 - 0, 255 - 0];
    this.spoutBar = [255 - 0, 255 - 250, 255 - 0];
    this.lines = [255 - 0, 255 - 0, 255 - 0];
    this.cup = [255 - 30, 255 - 217, 255 - 217];
    this.text = [255 - 0, 255 - 0, 255 - 0];

    this.applyColours();

  }

  setTheme1(){
    this.balls = [212, 190, 228];
    this.backGround = [155, 126, 189];
    this.buttons = [212, 190, 228];
    this.spout = [59, 30, 84];
    this.spoutBar = [212, 190, 228];
    this.lines = [59, 30, 84];
    this.cup = [212, 190, 228];
    this.text = [59, 30, 84];

    this.applyColours();
  }

  setTheme2(){
    this.balls = [200, 111, 77];
    this.backGround = [249, 243, 207];
    this.buttons = [221, 188, 137];
    this.spout = [150, 61, 27];
    this.spoutBar = [237, 231, 207];
    this.lines = [130, 41, 7];
    this.cup = [221, 188, 137];
    this.text = [100, 11, 0];

    this.applyColours();
  }

  setTheme3(){
    this.balls = [115, 236, 139];
    this.backGround = [210, 255, 114];
    this.buttons = [115, 236, 139];
    this.spout = [21, 179, 146];
    this.spoutBar = [84, 195, 146];
    this.lines = [21, 179, 146];
    this.cup = [115, 236, 139];
    this.text = [0, 108, 75];

    this.applyColours();
  }

  setSecret(){
    this.balls = [265, 189, 214];
    this.backGround = [255, 255, 255];
    this.buttons = [157, 227, 260];
    this.spout = [91, 206, 250];
    this.spoutBar = [245, 169, 184];
    this.lines = [91, 206, 250];
    this.cup = [245, 169, 184];
    this.text = [225, 149, 184];

    this.applyColours();
  }

  
}