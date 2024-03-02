const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let r = 20;
let a = prompt("請輸入1~10之間難度");
if (a > 10) {
  a = 10;
} else if (a < 1) {
  a = 1;
}
let xSpeed = 5 * a;
let ySpeed = 5 * a;
let ground_x = 100;
let ground_y = 480;
let ground_h = 5;
let brickArray = [];
let count = 0;

function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  //Check the condition if the ball hit the brick
  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - r &&
      ballX <= this.x + this.width + r &&
      ballY <= this.y + this.height + r &&
      ballY >= this.y - r
    );
  }
}

//Create all the bricks
for (let i = 0; i < 15; i++) {
  new Brick(getRandomArbitrary(30, 920), getRandomArbitrary(30, 500));
}

c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX - 100;
});

function drawCircle() {
  //Check if the ball hit the brick
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      //Change x, y direction's speed, and remove brick from brickArray
      if (circle_y >= brick.y + brick.height) {
        ySpeed *= -1;
        circle_y += 40;
      } else if (circle_y <= brick.y) {
        ySpeed *= -1;
        circle_y -= 40;
      } else if (circle_x >= brick.x + brick.width) {
        xSpeed *= -1;
        circle_x += 40;
      } else if (circle_x <= brick.x) {
        xSpeed *= -1;
        circle_x -= 40;
      }

      // brickArray.splice(index, 1); //O(n)
      // if (brickArray.length == 0) {
      //   alert("You win");
      //   clearInterval(game);
      // }
      if (count == 15) {
        alert("You win");
        clearInterval(game);
      }
    }
  });
  //Check if the ball hit the orange floor
  if (
    circle_x >= ground_x - r &&
    circle_x <= ground_x + 200 + r &&
    circle_y >= ground_y - r &&
    circle_y <= ground_y + r
  ) {
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }
  //Change the ball's location
  circle_x += xSpeed;
  circle_y += ySpeed;
  //Check if the ball hit the wall or not
  if (circle_x >= canvasWidth - r || circle_x <= r) {
    xSpeed *= -1;
  }
  if (circle_y >= canvasHeight - r || circle_y <= r) {
    ySpeed *= -1;
  }
  //Draw a black background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  //Draw all the bricks
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });
  //Draw a floor that able to control
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_h);
  //Draw the ball
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
