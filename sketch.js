let circles = []
const width = 400
const height = 400
let ray = new rayMarching(210, 200, 0)
let liner;
const steps = 55
const bounces = 3


function setup() {
  createCanvas(width, height);
  slider = createSlider(0, 360, 0, 1);
  deltaSlider = slider.value();

  createButton('stop').mousePressed(() => {
    noLoop()
  })

  for (let i = 0; i < 1; i += 0.1) {
    for (let j = 0; j < 1; j += 0.1) {
      if (j * width != 200 || i * width != 200)
        circles.push(...[ray.createCircle(j * width, i * width, 10)])

    }

  }
  background(220)






}
function draw() {
  if(mouseIsPressed){
  background(220)
    for (let i = 0; i < steps; i++) {
      ray = new rayMarching(mouseX, mouseY, i * (360 / steps))
      newRay()
      
      
    }

  }


}

function newRay() {
    let circleArray = [ray.startTracing(circles, 0, 0)];
  let linerStart = [createVector(ray.startX, ray.startX)];
  for (let j = 0; j < 3; j++) {
    newAngle = ray.bounce(circleArray[circleArray.length - 1])
    ray = new rayMarching(ray.x, ray.y, newAngle)
    circleArray.push(ray.startTracing(circles, 0, 0, circleArray[circleArray.length - 1].elementDone))
    linerStart.push(createVector(ray.startX, ray.startX))




  }
  circleArray.forEach((item, index) => {
    point(item.position.x, item.position.y)
  })

}
function drawCircles() {
  for (let i = 0; i < circles.length; i++) {
    circle(circles[i].x, circles[i].y, circles[i].r * 2)
  }
}