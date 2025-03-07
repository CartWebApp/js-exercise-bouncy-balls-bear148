// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const countElement = document.getElementById("count");
const velXSlider = document.getElementById("velXRange");
const velYSlider = document.getElementById("velYRange");
const trailSlider = document.getElementById("trails");

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let limit = 2;
let count = 0;

// function to generate random number

let balls = [];

let trail = 0.25;

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

while (balls.length < limit) {
    addBall();
}

function loop() {
    ctx.fillStyle = `rgba(0, 0, 0, ${trail})`;
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }
    requestAnimationFrame(loop);
}

function addBall() {
    let size = random(3, 10);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(parseInt(velXSlider.value) / 1.2, parseInt(velXSlider.value)),
        random(parseInt(velYSlider.value) / 1.2, parseInt(velYSlider.value)),
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    );
    balls.push(ball);
    count++;
    countElement.innerText = `Ball Count: ${count}`;
    
}

function removeBall() {
    if (balls.length != 0) {
        balls.pop();
        count--;
        countElement.innerText = `Ball Count: ${count}`;
    }
}

loop();

function updateVelocity() {
    for (let o of balls) {
        o.velX = random(parseInt(velXSlider.value) / 1.2, parseInt(velXSlider.value));
        o.velY = random(parseInt(velYSlider.value) / 1.2, parseInt(velYSlider.value));
    }
}

function updateTrail() {
    trail = parseFloat(trailSlider.value) / 100;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}