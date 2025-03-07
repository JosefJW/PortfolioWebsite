class Line {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.velx = dx;
        this.vely = dy;
        this.accx = 0;
        this.accy = 9.8;
        this.adjustmentMulp = 0.01;
        this.hue = Math.random() * 360;
    }

    move() {
        this.velx += this.accx * this.adjustmentMulp;
        this.vely += this.accy * this.adjustmentMulp;
        this.x += this.velx * this.adjustmentMulp;
        this.y += this.vely * this.adjustmentMulp;
    }

    gety() {
        return this.y;
    }

    draw(ctx) {
        ctx.fillStyle = `hsl(${this.hue}, 100%, 20%)`;
        ctx.fillRect(this.x, this.y, 3, 15);
    }
}