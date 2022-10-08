const keypress = require("keypress");
const colors = require("colors");

keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

// Variables: ---------------------------------------------

const width = 30;
const height = 15;

let speed = 20;
let snake, food;
let toDraw = [];
let c;

// Functions: ---------------------------------------------

function checkArray(arr, item) {
  for (var n = 0; n < arr.length; n++) {
    if (JSON.stringify(arr[n]) == JSON.stringify(item)) {
      return true;
    }
  }
  return false;
}

function scrn() {
  console.clear();
  console.log(colors.bold.magenta('Snake Game By Lexxrt (https://github.com/Lexxrt)'))
  console.log(colors.bold.green(`——————————————————————————————`));

  for (let i = 0; i < height; i++) {
    let l = "";

    for (let i2 = 0; i2 < width; i2++) {
      if (checkArray(toDraw, [i2, i])) {
        l += colors.bold.red("●");
      } else {
        l += colors.bgBlack(" ");
      }
    }

    console.log(l);
  }

  console.log(colors.bold.green(`——————————————————————————————`));
  console.log(colors.bold.white(`[Points]: ${toDraw.length - 5}`));
  console.log(colors.bold.white(`[Speed]: ${speed}`));
  console.log(colors.underline.yellow("Keybinds:"));
  console.log(colors.bold.cyan("W - Forward"));
  console.log(colors.bold.cyan("A - Left"));
  console.log(colors.bold.cyan("S - Down"));
  console.log(colors.bold.cyan("D - Right"));
  console.log(colors.bold.blue("K - Increase Speed"));
  console.log(colors.bold.blue("L - Decrease Speed"));
  console.log(colors.bold.gray("R - Restart"));
}

function update() {
  toDraw = [];
  snake.update();
  food.update();
  scrn();
}

function start() {
  snake = new Snake();
  food = new Food();

  if (c) clearInterval(c);

  c = setInterval(update, 1000 / speed);
}

// Classes: ---------------------------------------------

class Snake {
  constructor() {
    this.body = [
      [10, 10],
      [10, 11],
      [10, 12],
      [10, 13],
    ];
    this.direction = [1, 0];
  }

  update() {
    const { body } = this;
    let { direction } = this;

    let nextPos = [body[0][0] + direction[0], body[0][1] + direction[1]];

    if (nextPos[1] >= height) nextPos[1] = 0;

    if (nextPos[1] < 0) nextPos[1] = height;

    if (nextPos[0] >= width) nextPos[0] = 0;

    if (nextPos[0] < 0) nextPos[0] = width;

    if (nextPos[0] === body[1][0] && nextPos[1] === body[1][1]) {
      body.reverse();
      nextPos = [body[0][0] + direction[0], body[0][1] + direction[1]];
    }

    if (checkArray(body, nextPos)) {
      start();
      return;
    }

    if (nextPos[0] === food.position[0] && nextPos[1] === food.position[1]) {
      this.grow();
      food.onCapture();
    }

    this.body.pop();
    this.body.splice(0, 0, nextPos);

    snake.draw();
  }

  onKeyPress(key) {
    switch (key.name) {
      case "w":
        this.direction = [0, -1];
        break;
      case "s":
        this.direction = [0, 1];
        break;
      case "a":
        this.direction = [-1, 0];
        break;
      case "d":
        this.direction = [1, 0];
        break;
    }
  }

  grow() {
    const lastPos = this.body[this.body.length - 1];
    const newPos = [lastPos[0] + 1, lastPos[1]];
    this.body.push(newPos);
  }

  draw() {
    toDraw = [...toDraw, ...this.body];
  }
}

class Food {
  constructor() {
    this.position = [15, 6];
  }

  setNewPosition() {
    this.position[0] = Math.round(Math.random() * (width - 1));
    this.position[1] = Math.round(Math.random() * (height - 1));
  }

  onCapture() {
    this.setNewPosition();
  }

  update() {
    this.draw();
  }

  draw() {
    toDraw = [...toDraw, this.position];
  }
}

process.stdin.on("keypress", (ch, key) => {
  if (key && key.ctrl && key.name === "c") {
    process.exit();
  }

  if (key.name === "r") {
    start();
    return;
  }

  if (key.name === "k") {
    if (speed >= 30) return;
    speed += 1;
    start();
    return;
  }

  if (key.name === "l") {
    if (speed <= 10) return;
    speed -= 1;
    start();
    return;
  }

  snake.onKeyPress(key);
});

start();
