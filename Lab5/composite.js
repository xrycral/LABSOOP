const CIRCLE_RADIUS = 7;
const CUBE_SHIFT = 0.35;

class CompositeShape extends Shape {
  constructor() {
    super();
    if (new.target === CompositeShape) {
      throw new Error('CompositeShape – абстрактний клас, створювати його не можна');
    }
    this.parts = [];
  }

  setStart(x, y) { super.setStart(x, y); this.updateParts(); }
  setEnd(x, y) { super.setEnd(x, y); this.updateParts(); }

  updateParts() { throw new Error('updateParts() не реалізовано'); }

  show(ctx) {
    for (const part of this.parts) part.show(ctx);
  }

  showRubber(ctx) {
    for (const part of this.parts) part.showRubber(ctx);
  }
}

class LineOShape extends CompositeShape {
  constructor() {
    super();
    this.line = new LineShape();
    this.startCircle = new EllipseShape();
    this.endCircle = new EllipseShape();
    this.line.style.outline = '#1b5e20';
    for (const circle of [this.startCircle, this.endCircle]) {
      circle.style.outline = '#1b5e20';
      circle.style.fill = '#a5d6a7';
    }
    this.parts = [this.line, this.startCircle, this.endCircle];
  }

  updateParts() {
    this.line.setStart(this.x1, this.y1);
    this.line.setEnd(this.x2, this.y2);
    this.startCircle.setStart(this.x1, this.y1);
    this.startCircle.setEnd(this.x1 + CIRCLE_RADIUS, this.y1 + CIRCLE_RADIUS);
    this.endCircle.setStart(this.x2, this.y2);
    this.endCircle.setEnd(this.x2 + CIRCLE_RADIUS, this.y2 + CIRCLE_RADIUS);
  }
}

class CubeShape extends CompositeShape {
  constructor() {
    super();
    this.front = new RectShape();
    this.back = new RectShape();
    this.edges = [new LineShape(), new LineShape(), new LineShape(), new LineShape()];
    this.parts = [this.back, ...this.edges, this.front];
    for (const part of this.parts) {
      part.style.outline = '#4a148c';
      part.style.fill = null;
    }
  }

  updateParts() {
    const left = Math.min(this.x1, this.x2);
    const top = Math.min(this.y1, this.y2);
    const w = Math.abs(this.x2 - this.x1);
    const h = Math.abs(this.y2 - this.y1);
    const s = Math.round(Math.min(w, h) * CUBE_SHIFT);

    this.front.setStart(left, top);
    this.front.setEnd(left + w, top + h);
    this.back.setStart(left + s, top - s);
    this.back.setEnd(left + w + s, top + h - s);

    const corners = [[left, top], [left + w, top], [left, top + h], [left + w, top + h]];
    corners.forEach(([cx, cy], i) => {
      this.edges[i].setStart(cx, cy);
      this.edges[i].setEnd(cx + s, cy - s);
    });
  }
}

ShapeFactory.register('lineo', LineOShape);
ShapeFactory.register('cube', CubeShape);