class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('Shape – абстрактний клас, створювати його не можна');
    }
    this.x1 = 0; this.y1 = 0;
    this.x2 = 0; this.y2 = 0;
  }

  get needsDrag() { return true; }

  setStart(x, y) { this.x1 = x; this.y1 = y; this.x2 = x; this.y2 = y; }
  setEnd(x, y) { this.x2 = x; this.y2 = y; }

  applyRubberStyle(ctx) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
  }

  show(ctx) { throw new Error('show() не реалізовано'); }
  showRubber(ctx) { throw new Error('showRubber() не реалізовано'); }
}

class PointShape extends Shape {
  get needsDrag() { return false; }

  show(ctx) {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x1, this.y1, 2.5, 0, 2 * Math.PI);
    ctx.fill();
  }

  showRubber(ctx) {
    this.applyRubberStyle(ctx);
    ctx.beginPath();
    ctx.arc(this.x1, this.y1, 2.5, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

class LineShape extends Shape {
  show(ctx) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }

  showRubber(ctx) {
    this.applyRubberStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }
}

class RectShape extends Shape {
  bounds() {
    const halfW = Math.abs(this.x2 - this.x1);
    const halfH = Math.abs(this.y2 - this.y1);
    return { left: this.x1 - halfW, top: this.y1 - halfH, w: 2 * halfW, h: 2 * halfH };
  }

  show(ctx) {
    const b = this.bounds();
    ctx.fillStyle = '#ffc0cb';
    ctx.fillRect(b.left, b.top, b.w, b.h);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeRect(b.left, b.top, b.w, b.h);
  }

  showRubber(ctx) {
    const b = this.bounds();
    this.applyRubberStyle(ctx);
    ctx.strokeRect(b.left, b.top, b.w, b.h);
  }
}

class EllipseShape extends Shape {
  geometry() {
    return {
      cx: (this.x1 + this.x2) / 2,
      cy: (this.y1 + this.y2) / 2,
      rx: Math.abs(this.x2 - this.x1) / 2,
      ry: Math.abs(this.y2 - this.y1) / 2
    };
  }

  show(ctx) {
    const g = this.geometry();
    ctx.beginPath();
    ctx.ellipse(g.cx, g.cy, g.rx, g.ry, 0, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.stroke();
  }

  showRubber(ctx) {
    const g = this.geometry();
    this.applyRubberStyle(ctx);
    ctx.beginPath();
    ctx.ellipse(g.cx, g.cy, g.rx, g.ry, 0, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
