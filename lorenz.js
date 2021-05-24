let SIGMA = 10;
let RHO = 28;
let BETA = 8 / 3;
let TIME_STEP = 0.01;
let COLOR_OFFSET = 0;
let MAX_TRAIL_LENGTH = 100;
let POINTS_COUNT = 30;
let points;
let debug = false;

class Point {
  constructor(x, y, z) {
    this.start = createVector(x, y, z);
    this.trail = [];
    this.head = this.start;
    this.color = {
			r: 255,
			g: Math.random() * 255,
			b: Math.random() * 50,
		};
  }

  update() {
    let next = createVector(
			SIGMA * (this.head.y - this.head.x) * TIME_STEP,
			(this.head.x * (RHO - this.head.z) - this.head.y) * TIME_STEP,
			(this.head.x * this.head.y - BETA * this.head.z) * TIME_STEP
    );
    
    this.head = this.head.add(next);
    this.trail.push(this.head.copy());
    if (this.trail.length > MAX_TRAIL_LENGTH) this.trail.shift();
  }

  display() {
    strokeWeight(2);
    noFill();
    let prev = this.trail[0];
    for (let i = 1; i < this.trail.length; ++i) {
      let next = this.trail[i];
      // let color = palette(
			// 	i,
			// 	createVector(0.5, 0.5, 0.5),
			// 	createVector(0.5, 0.5, 0.5),
			// 	createVector(1.0, 1.0, 1.0),
			// 	createVector(0.0, 0.1, 0.2)
			// );
      stroke(
				this.color.r,
				255 - (this.trail.length - i) * (255 / MAX_TRAIL_LENGTH),
				this.color.b + COLOR_OFFSET,
				100 - (this.trail.length - i) * (100 / MAX_TRAIL_LENGTH)
			);
      // stroke(
      //   color.r * 255,
      //   color.g * 255,
      //   color.b * 255,
      //   100 - (this.trail.length - i) * (100 / MAX_TRAIL_LENGTH)
			// );
      line(prev.x, prev.y, prev.z, next.x, next.y, next.z);
      prev = next;
    }
  }
}

function palette(t, a, b, c, d )
{
  let result = {
    r: 0,
    g: 0,
    b: 0,
  }

  result.r = a.x + b.x * cos(6.28318 * (c.x * t + d.x));
  result.g = a.y + b.y * cos(6.28318 * (c.y * t + d.y));
  result.b = a.z + b.z * cos(6.28318 * (c.z * t + d.z));

  return result;
}

function resetSketch() {
  points = new Array;
	for (let i = 0; i < POINTS_COUNT; i++) {
		let randomCoordinate = Math.random() * (Math.random() < 0.5 ? -1 : 1) * 10;
		points.push(
			new Point(randomCoordinate, randomCoordinate, randomCoordinate)
		);
	}
}

function createMenu() {
  let menu = {
		lab_SIGMA: createElement("p", "Sigma"),
		inp_SIGMA: createInput(SIGMA),
		lab_RHO: createElement("p", "Rho"),
		inp_RHO: createInput(RHO),
		lab_BETA: createElement("p", "Beta"),
		inp_BETA: createInput(BETA),
		lab_COLOR_OFFSET: createElement("p", "Color offset"),
		inp_COLOR_OFFSET: createInput(COLOR_OFFSET),
		lab_MAX_TRAIL_LENGTH: createElement("p", "Max trail length"),
		inp_MAX_TRAIL_LENGTH: createInput(MAX_TRAIL_LENGTH),
		lab_POINTS_COUNT: createElement("p", "Number of generated points"),
		inp_POINTS_COUNT: createInput(POINTS_COUNT),
	};
  for (el in menu) {
    menu[el].parent('input');
  }

  menu.inp_SIGMA.input(changeSigma);
  menu.inp_BETA.input(changeBeta);
  menu.inp_RHO.input(changeRho);
  menu.inp_COLOR_OFFSET.input(changeColorOffset);
  menu.inp_MAX_TRAIL_LENGTH.input(changeTrailLength);
  menu.inp_POINTS_COUNT.input(changePointsCount);

  let reset = createButton("Reset");
  createElement("br").parent('input');
  createElement("br").parent("input");
  reset.parent('input');
  reset.mousePressed(resetSketch);
  let dbg = createButton("Debug");
  dbg.parent('input');
  dbg.mousePressed(() => {
    debug = !debug;
  });
  let loopBtn = createButton("Stop");
  loopBtn.parent('input');
  loopBtn.mousePressed(() => {
    if (loopBtn.html() == "Start") {
      loopBtn.html("Stop");  
      start();
    }
    else if (loopBtn.html() == "Stop") {
      loopBtn.html("Start");
      stop();
    }
    
  });
}

function changeSigma() { SIGMA = parseFloat(this.value()); }
function changeRho() { RHO = parseFloat(this.value()); }
function changeBeta() { BETA = parseFloat(this.value()); }
function changeColorOffset() { COLOR_OFFSET = parseFloat(this.value()); }
function changeTrailLength() { MAX_TRAIL_LENGTH = parseFloat(this.value()); }
function changePointsCount() { POINTS_COUNT = parseFloat(this.value()); }


function stop() {
  noLoop();
}

function start() {
  loop();
}

function setup() {
  createMenu();

  let canvas = createCanvas(windowHeight, windowHeight, WEBGL);
  canvas.parent('sketch');

  resetSketch();

  colorMode(RGB, 255);
  normalMaterial();
}

function draw() {
  if (!debug) noDebugMode();
  else debugMode(AXES);

  background(0);
  orbitControl();
  if (!frameRate()) return;

	translate(0, 0, 0);
	scale(width / 100);

  for (p of points) {
    p.update();
    p.display();
  }
}