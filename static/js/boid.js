const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const text = document.getElementById("overlay-container");
const text_rect = text.getBoundingClientRect();

const draw_trails = false;

let boid_count = 100;

// window.addEventListener("mousedown", function (event) {
//     if ((event.clientX < text_rect.left || event.clientX > text_rect.right) && 
//         (event.clientY < text_rect.top || event.clientY > text_rect.bottom)) {
//         predators.push(new predator(event.x, event.y));
//     }
// })

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let cursorPosition = { x: 0, y: 0 }; // Start off-screen

document.addEventListener("mousemove", (event) => {
    cursorPosition.x = event.clientX;
    cursorPosition.y = event.clientY;
});


class boid {
    constructor() {
        this.position = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        };
        this.velocity = {
            x: Math.random() * 10 - 5,
            y: Math.random() * 10 - 5
        };
        this.acceleration = {
            x: 0,
            y: 0
        };
        this.maxForce = 0.03;
        this.size = Math.random() * 15 + 15;
        this.maxSpeed = 50/this.size;
        this.color = Math.random() * 360;
        this.trail = [];
        this.blinking = false;
        this.blinkTime = Math.random() * 3000 + 2000; // Random interval between 2-5 seconds
        this.lastBlink = performance.now();
        this.eyeBlinkProgress = 0;
        this.separation = 2.5;
        this.eyeX = (Math.random() * 10 - 5) * this.size/50;
        this.eyeY = (Math.random() * 10 - 5) * this.size/50;
    }

    draw() {
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);

        // Draw boid body
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(-this.size, -this.size / 2);
        ctx.lineTo(-this.size, this.size / 2);
        ctx.closePath();
        ctx.fillStyle = `hsl(${this.color}, 100%, 50%)`;
        ctx.fill();

        // Eye positions
        let eyeOffsetX = this.size * 0.5;
        let eyeOffsetY = this.size * 0.3;
        let eyeRadius = this.size * 0.2;
        let eyelidHeight = eyeRadius * this.eyeBlinkProgress;

        // Draw eyes
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(eyeOffsetX, -eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffsetX, eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw pupils
        let pupilOffsetX = this.velocity.x * 2;
        let pupilOffsetY = this.velocity.y * 2;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(eyeOffsetX + eyeRadius * 0.2 + this.eyeX, -eyeOffsetY + this.eyeY, eyeRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffsetX + eyeRadius * 0.2 + this.eyeX, eyeOffsetY + this.eyeY, eyeRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        if (this.blinking) {
            ctx.fillStyle = `hsl(${this.color}, 100%, 50%)`;
            ctx.beginPath();
            ctx.arc(eyeOffsetX, -eyeOffsetY, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(eyeOffsetX, eyeOffsetY, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
        }        

        ctx.restore();
    }
    

    update() {
        this.trail.unshift({ x: this.position.x, y: this.position.y });
        if (this.trail.length > 10) {
            this.trail.pop();
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.acceleration.x = 0;
        this.acceleration.y = 0;
        if (this.position.x > canvas.width) {
            // this.velocity.x = -this.velocity.x;
            // this.position.x = canvas.width;
            this.position.x = 0;
        } else if (this.position.x < 0) {
            // this.velocity.x = -this.velocity.x;
            // this.position.x = 0;
            this.position.x = canvas.width;
        }
        if (this.position.y > canvas.height) {
            // this.velocity.y = -this.velocity.y;
            // this.position.y = canvas.height;
            this.position.y = 0;
        }
        else if (this.position.y < 0) {
            // this.velocity.y = -this.velocity.y;
            // this.position.y = 0;
            this.position.y = canvas.height;
        }
        if ((this.velocity.x ** 2 + this.velocity.y ** 2) ** 0.5 > this.maxSpeed) {
            this.velocity.x /= (this.velocity.x ** 2 + this.velocity.y ** 2) ** 0.5;
            this.velocity.y /= (this.velocity.x ** 2 + this.velocity.y ** 2) ** 0.5;
            this.velocity.x *= this.maxSpeed;
            this.velocity.y *= this.maxSpeed;
        }

        let now = performance.now();

        // Check if it's time to start blinking
        if (!this.blinking && now - this.lastBlink > this.blinkTime) {
            this.blinking = true;
        }

        // Animate eyelid closing and opening
        if (this.blinking) {
            if (this.eyeBlinkProgress < 1) {
                this.eyeBlinkProgress += 0.2; // Speed of closing
            } else {
                setTimeout(() => {
                    this.blinking = false;
                    this.lastBlink = performance.now();
                    this.blinkTime = Math.random() * 3000 + 2000; // Reset blink timer
                }, 150); // Closed for 150ms
            }
        } else if (this.eyeBlinkProgress > 0) {
            this.eyeBlinkProgress -= 0.1; // Speed of opening
        }
    }

    flock(perceived_boids, predators) {
        let alignment = this.align(perceived_boids);
        let cohesion = this.cohere(perceived_boids);
        let separation = this.separate(perceived_boids);
        let edge = this.edge();
        let scram = this.scram(predators);
        let cursor = this.cursor_scram();

        this.acceleration.x += alignment.x;
        this.acceleration.y += alignment.y;
        this.acceleration.x += cohesion.x;
        this.acceleration.y += cohesion.y;
        this.acceleration.x += separation.x;
        this.acceleration.y += separation.y;
        //this.acceleration.x += edge.x;
        //this.acceleration.y += edge.y;
        this.acceleration.x += scram.x;
        this.acceleration.y += scram.y;
        this.acceleration.x += cursor.x;
        this.acceleration.y += cursor.y;
        this.acceleration.x += Math.random() * 0.01 - 0.005;
        this.acceleration.y += Math.random() * 0.01 - 0.005;
    }

    find_closest(boids) {
        let closest = Infinity;
        let closestBoid = null;
        for (let i = 0; i < boids.length; i++) {
            let distance = Math.sqrt((this.position.x - boids[i].position.x) ** 2 + (this.position.y - boids[i].position.y) ** 2);
            if (distance < closest && distance !== 0) {
                closest = distance;
                closestBoid = boids[i];
            }
        }
        return closestBoid;
    }

    find_closest_n(boids, n) {
        if (n < 1) {
            n = 1;
        }
        let closest = [];
        let boids_copy = boids.slice();
        for (let i = 0; i < n; i++) {
            let closestBoid = this.find_closest(boids_copy);
            closest.push(closestBoid);
            boids_copy.splice(boids_copy.indexOf(closestBoid), 1);
        }
        return closest;
    }

    align(boids) {
        let velocitySum = 0;
        let count = 0;
        for (const boid of boids) {
            if (boid) {
                velocitySum += boid.velocity.x;
                velocitySum += boid.velocity.y;
                count++;
            }
        }
        let average = {
            x: velocitySum / count,
            y: velocitySum / count
        };
        let steer = {
            x: average.x - this.velocity.x,
            y: average.y - this.velocity.y
        };
        return this.limit(steer, this.maxForce);
    }

    cohere(boids) {
        let positionSum = {
            x: 0,
            y: 0
        };
        let count = 0;
        for (const boid of boids) {
            positionSum.x += boid.position.x;
            positionSum.y += boid.position.y;
            count++;
        }
        let average = {
            x: positionSum.x / count,
            y: positionSum.y / count
        };
        let desired = {
            x: average.x - this.position.x,
            y: average.y - this.position.y
        };
        return this.limit(desired, this.maxForce);
    }

    separate(boids) {
        let desired = { x: 0, y: 0 };
        let count = 0;
    
        for (const boid of boids) {
            if (boid !== this) { // Ensure we don’t compare the boid to itself
                let dx = this.position.x - boid.position.x;
                let dy = this.position.y - boid.position.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
    
                if (distance < 20) {
                    let difference = { x: dx / distance, y: dy / distance }; // Normalize
                    desired.x += difference.x;
                    desired.y += difference.y;
                    count++;
                }
            }
        }
    
        if (count > 0) {
            desired.x /= count;
            desired.y /= count;
    
            // Set magnitude to max speed
            let magnitude = Math.sqrt(desired.x * desired.x + desired.y * desired.y);
            if (magnitude > 0) {
                desired.x = (desired.x / magnitude) * this.maxSpeed;
                desired.y = (desired.y / magnitude) * this.maxSpeed;
            }
    
            // Steering = desired - velocity
            let steer = {
                x: desired.x - this.velocity.x,
                y: desired.y - this.velocity.y
            };
    
            // Limit force
            return this.limit(steer, this.maxForce*this.separation);
        }
    
        return { x: 0, y: 0 }; // No change if no nearby boids
    }

    edge() {
        let desired = { x: 0, y: 0 };
        let margin = Math.min(canvas.width, canvas.height)/10; // Distance from edge to start steering
        let strength = 2; // Strength of the steering force
    
        if (this.position.x < margin) {
            desired.x = strength * (margin - this.position.x) / margin;
        } else if (this.position.x > canvas.width - margin) {
            desired.x = -strength * (this.position.x - (canvas.width - margin)) / margin;
        }
    
        if (this.position.y < margin) {
            desired.y = strength * (margin - this.position.y) / margin;
        } else if (this.position.y > canvas.height - margin) {
            desired.y = -strength * (this.position.y - (canvas.height - margin)) / margin;
        }
    
        return this.limit(desired, this.maxForce*(this.velocity.x**2 + this.velocity.y**2)**0.5*2);
    }

    scram(predators) {
        let desired = { x: 0, y: 0 };
        let count = 0;
    
        for (const predator of predators) {
            let dx = this.position.x - predator.position.x;
            let dy = this.position.y - predator.position.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance < 100) {
                let difference = { x: dx / distance, y: dy / distance }; // Normalize
                desired.x += difference.x;
                desired.y += difference.y;
                count++;
            }
        }
    
        if (count > 0) {
            desired.x /= count;
            desired.y /= count;
    
            // Set magnitude to max speed
            let magnitude = Math.sqrt(desired.x * desired.x + desired.y * desired.y);
            if (magnitude > 0) {
                desired.x = (desired.x / magnitude) * this.maxSpeed;
                desired.y = (desired.y / magnitude) * this.maxSpeed;
            }
    
            // Steering = desired - velocity
            let steer = {
                x: desired.x - this.velocity.x,
                y: desired.y - this.velocity.y
            };
    
            // Limit force
            return this.limit(steer, this.maxForce*5);
        }
    
        return { x: 0, y: 0 }; // No change if no nearby
    }
    
    cursor_scram() {
        let avoidance = { x: 0, y: 0 };

        let dx = this.position.x - cursorPosition.x;
        let dy = this.position.y - cursorPosition.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 300) { // Change 100 to adjust avoidance range
            let force = Math.max(10 - distance / 10, 0);
            avoidance.x += (dx / distance) * force;
            avoidance.y += (dy / distance) * force;
        }
    
        return this.limit(avoidance, this.maxForce * 20);
    }

    limit(vector, limit) {
        let magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
        if (magnitude > limit) {
            vector.x /= magnitude;
            vector.y /= magnitude;
            vector.x *= limit;
            vector.y *= limit;
        }
        return vector;
    }
}

class predator {
    constructor(x, y) {
        if (x && y) {
            this.position = {
                x: x,
                y: y
            }
        } else if (x) {
            this.position = {
                x: x,
                y: Math.random() * canvas.height
            }
        } else if (y) {
            this.position = {
                x: Math.random() * canvas.width,
                y: y
            }
        } else {
            this.position = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            }
        }
        this.velocity = {
            x: Math.random() * 10 - 5,
            y: Math.random() * 10 - 5
        };
        this.acceleration = {
            x: 0,
            y: 0
        };
        this.maxSpeed = 0.5;
        this.maxForce = 0.03;
        this.size = 30;
        this.color = `white`;
        this.trail = [];
        this.eyeX = 5;
        this.eyeY = 0;
    }

    draw() {
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
    
        // Draw boid body
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(-this.size, -this.size / 2);
        ctx.lineTo(-this.size, this.size / 2);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
    
        // Eye positions
        let eyeOffsetX = this.size * 0.5;
        let eyeOffsetY = this.size * 0.3;
        let eyeRadius = this.size * 0.2;
    
        // Draw eyes (Evil style)
        ctx.fillStyle = "pink"; // White part of the eyes
        ctx.beginPath();
        ctx.arc(eyeOffsetX, -eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffsetX, eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
    
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(eyeOffsetX + this.eyeX, -eyeOffsetY + this.eyeY, eyeRadius * 0.3, 0, Math.PI * 2); // Evil looking pupils
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffsetX + this.eyeX, eyeOffsetY + this.eyeY, eyeRadius * 0.3, 0, Math.PI * 2); // Evil looking pupils
        ctx.fill();
    
        ctx.restore();
    }
    

    update() {
        this.trail.unshift({ x: this.position.x, y: this.position.y });
        if (this.trail.length > 10) {
            this.trail.pop();
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.acceleration.x = 0;
        this.acceleration.y = 0;
        if (this.position.x > canvas.width) {
            this.velocity.x = -this.velocity.x;
            this.position.x = canvas.width;
            // this.position.x = 0;
        } else if (this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
            this.position.x = 0;
            // this.position.x = canvas.width;
        }
        if (this.position.y > canvas.height) {
            this.velocity.y = -this.velocity.y;
            this.position.y = canvas.height;
            // this.position.y = 0;
        }
        else if (this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
            this.position.y = 0;
            // this.position.y = canvas.height;
        }
        if ((this.velocity.x ** 2 + this.velocity.y ** 2) ** 0.5 > this.maxSpeed) {
            this.velocity.x /= (this.velocity.x ** 2 + this.velocity.y ** 2) ** 0.5;
            this.velocity.y /= (this.velocity.x ** 2 + this.velocity.y ** 2) ** 0.5;
            this.velocity.x *= this.maxSpeed;
            this.velocity.y *= this.maxSpeed;
        }
    }

    flock(perceived_boids) {
        let hunt = this.hunt(perceived_boids);
        let edge = this.edge();

        this.acceleration.x += hunt.x;
        this.acceleration.y += hunt.y;
        this.acceleration.x += edge.x;
        this.acceleration.y += edge.y;
        this.acceleration.x += Math.random() * 0.03 - 0.015;
        this.acceleration.y += Math.random() * 0.03 - 0.015;
    }

    hunt(boids) {
        if (boids.length === 0) {
            return { x: 0, y: 0 };  // No force if no boids
        }
    
        let positionSum = { x: 0, y: 0 };
        let count = 0;
        for (const boid of boids) {
            positionSum.x += boid.position.x;
            positionSum.y += boid.position.y;
            count++;
        }
    
        // Calculate the average position
        let average = {
            x: positionSum.x / count,
            y: positionSum.y / count
        };
    
        // Calculate the steering force towards the average
        let steer = {
            x: average.x - this.position.x,
            y: average.y - this.position.y
        };
    
        // Apply a limit to the force to avoid fast or abrupt movements
        return this.limit(steer, this.maxForce);
    }
    

    edge() {
        let desired = { x: 0, y: 0 };
        let margin = Math.min(canvas.width, canvas.height)/10;
        let strength = 2;
    
        if (this.position.x < margin) {
            desired.x = strength * (margin - this.position.x) / margin;
        } else if (this.position.x > canvas.width - margin) {
            desired.x = -strength * (this.position.x - (canvas.width - margin)) / margin;
        }
    
        if (this.position.y < margin) {
            desired.y = strength * (margin - this.position.y) / margin;
        } else if (this.position.y > canvas.height - margin) {
            desired.y = -strength * (this.position.y - (canvas.height - margin)) / margin;
        }
    
        return this.limit(desired, this.maxForce*(this.velocity.x**2 + this.velocity.y**2)**0.5*3);
    }

    limit(vector, limit) {
        let magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
        if (magnitude > limit) {
            vector.x /= magnitude;
            vector.y /= magnitude;
            vector.x *= limit;
            vector.y *= limit;
        }
        return vector;
    }

    find_closest(boids) {
        let closest = Infinity;
        let closestBoid = null;
        for (let i = 0; i < boids.length; i++) {
            let distance = Math.sqrt((this.position.x - boids[i].position.x) ** 2 + (this.position.y - boids[i].position.y) ** 2);
            if (distance < closest && distance !== 0) {
                closest = distance;
                closestBoid = boids[i];
            }
        }
        return closestBoid;
    }

    find_closest_n(boids, n) {
        if (n < 1) {
            n = 1;
        }
        let closest = [];
        let boids_copy = boids.slice();
        for (let i = 0; i < n; i++) {
            let closestBoid = this.find_closest(boids_copy);
            closest.push(closestBoid);
            boids_copy.splice(boids_copy.indexOf(closestBoid), 1);
        }
        return closest;
    }
}


const boids = [];
for (let i = 0; i < boid_count; i++) {
    boids.push(new boid());
}
const predators = [];
for (let i = 0; i < 0; i++) {
    predators.push(new predator());
}

let frameTimes = [];
let lastTime = performance.now();

function animate() {
    let currentTime = performance.now();
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    frameTimes.push(deltaTime);
    if (frameTimes.length > 30) frameTimes.shift(); // Keep last 30 frames

    let avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    let fps = 1000 / avgFrameTime;

    // Adjust boids count dynamically
    if (fps < 60 && boids.length > 20) {
        boids.pop(); // Remove a boid if FPS is too low
    } else if (fps > 100 && boids.length < 500) {
        boids.push(new boid()); // Add a boid if FPS is good
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const boid of boids) {
        boid.flock(boid.find_closest_n(boids, Math.ceil(boids.length / 50)), predators);
        boid.update();
        boid.draw();
    }
    for (const predator of predators) {
        predator.flock(predator.find_closest_n(boids, Math.ceil(boids.length / 25)));
        predator.update();
        predator.draw();
        for (const b of boids) {
            let dx = predator.position.x - b.position.x;
            let dy = predator.position.y - b.position.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 20) {
                boids.splice(boids.indexOf(b), 1);
                boids.push(new boid());
            }
        }
    }
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);