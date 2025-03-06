const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let lines = [];

function setup() {
    for (let i = 0; i < 1; i++) {
        lines.push(new Line(Math.random() * canvas.width, canvas.height, 0, -(Math.random() * 150 + 25)))
    }
}

function fadeCanvas(ctx, fadeAmount = 0.01) {
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeAmount})`; // Black with transparency
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}


function animate() {
    fadeCanvas(ctx);
    for (let line of lines) {
        line.move();
        line.draw(ctx);
    }
    lines = lines.filter(line => line.gety() <= 2 * canvas.height);
    if (Math.random() <= canvas.width / (5*1920)) { lines.push(new Line(Math.random() * canvas.width, canvas.height, 0, -(Math.random() * 150 + 25)))}
    requestAnimationFrame(animate);
}

setup();
animate();