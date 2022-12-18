let circleObj = { x: 0, y: 0, r: 10 }
let squareObj = { x1:0, y1: 0, x2: 0, y2: 0}
let lineObj = { x1:0, y1: 0, x2: 0, y2: 0}
let circles = []
let squares = []
let lines = []
let rayStart = {x:0,y:0}
let ray = new rayMarching(200, 200, 0);
let rayPos = new rayMarching(200, 200, 0);

let rays = []
let steps = 200
let slider = null

function setup() {
  createCanvas(400, 400);
  rayStart.x = random(50, 350); rayStart.y = random(50, 350)

  //add corresponding shape to its array
  for (let i = 0; i < 90; i++) {
    circles.push(...[{circleObj}])
  }
  for (let i = 0; i < 20; i++) {

    squares.push(...[{squareObj}])
  }
  for (let i = 0; i < 20; i++) {

    lines.push(...[{lineObj}])
  }
  print(lines)

  // set circles to random positions
  for (let i = 0; i < circles.length; i++) {
    const element = circles[i];
    element.r = random(3, 20);
    element.x = random(0, 400);
    element.y = random(0, 400);
  }
  //set squares to random positions and length
  for (let i = 0; i < squares.length; i++) {
    const element = squares[i];
    element.x1 = random(0, 400);
    element.y1 = random(0, 400);
    element.x2 = element.x1 + random(5, 30);
    element.y2 = element.y1 + random(5,30);
  }
  //do the same as the square method but for the line array
  for (let i = 0; i < lines.length; i++) {
    const element = lines[i];
    element.x1 = random(0, 400);
    element.y1 = random(0, 400);
    element.x2 = element.x1 + random(5, 30);
    element.y2 = element.y1 + random(5,30);
  }
  //start new ray marching adn rotate it around the light source
  for (let i = 0; i < steps; i++) {
    ray = new rayMarching(rayStart.x, rayStart.y, i * (360 / steps))
    let rayDone = ray.startTracing(circles, squares, lines)
    rays.push(rayDone)
    
  }
  //create the restart and stop buttons
  createButtons()
  
  // create slider
  slider = createSlider(20,360*2,150,1)
  
}


function draw() {
    // print(squares)
    // print(rays)
    background(220);
    fill("white")
    //draw all circles
    for (let i = 0; i < circles.length; i++) {
      stroke("black")
      const element = circles[i];
      circle(element.x, element.y, element.r)
    }

    //draw all squares
    for (let i = 0; i < squares.length; i++) {
      stroke("black")
      const element = squares[i];
      rectMode(CORNERS)
      rect(element.x1, element.y1, element.x2, element.y2)
    }

    //do the same as the square for loop but draw a line instead of a rectangle
    for (let i = 0; i < lines.length; i++) {
      stroke("black")
      const element = lines[i];
      line(element.x1, element.y1, element.x2, element.y2)
    }

    //draw rays
    for (let i = 0; i < steps; i++) {
      if (rays.length >= 2) {
        circle(rays[i][0].x, rays[i][0].y, 2)
        stroke("white")
        line(rays[i][1].x, rays[i][1].y, rays[i][0].x, rays[i][0].y)
        // stroke("black")
        // print(rays[i])
        
        
      }
      stroke("green")
      fill("green")
      circle(rayStart.x, rayStart.y, 5)
      stroke("white")

    }

    //be able to move the light
    if(mouseIsPressed){
      rayStart.x = mouseX; rayStart.y = mouseY
      
      
      rays = []
      for (let i = 0; i < steps; i++) {
        if(steps != slider.value()) return
        ray = new rayMarching(rayStart.x, rayStart.y, i * (360 / steps))
        // rayPos = new rayMarching(rayStart.x, rayStart.y, i * (360 / steps))
        let rayDone = ray.startTracing(circles, squares, lines)
        let rayElement = ray.startTracing(circles, squares, lines, true)
        rays.push(rayDone)
        // let newAngle = ray.bounce(rayElement);
        // ray = new rayMarching(ray.x, ray.y, ray.angle + newAngle)
        // rayDone = ray.startTracing(circles, squares, lines)
        // rays.push(rayDone)
      }
    }
    steps = slider.value();


}


function createButtons() {
  let trigger = false;
  // create stop button
  createButton("stop").mouseClicked(() => {
    //every time pressed toggle trigger
    trigger = !trigger
    if (trigger) {
      noLoop()
    } else {
      loop()
    }
  })
  createButton("restart").mouseClicked(() => {

    // restart the pos every time pressed

    rayStart.x = random(50, 350); rayStart.y = random(50, 350)

    rays = []
    for (let i = 0; i < steps; i++) {
      ray = new rayMarching(rayStart.x, rayStart.y, i * (360 / steps))
      let rayDone = ray.startTracing(circles, squares, lines)
      rays.push(rayDone)

    }
  })

}