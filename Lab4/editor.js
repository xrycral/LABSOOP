const VARIANT = 21;
const N = VARIANT + 100;

class MyEditor {
  constructor() {
    this.pcshape = new Array(N).fill(null);
    this.count = 0;
    this.type = 'point';
    this.current = null;
  }

  get capacity() { return N; }
  get isDrawing() { return this.current !== null; }

  setType(id) {
    if (ShapeFactory.has(id)) this.type = id;
  }

  start(x, y) {
    if (this.count >= N) return;
    this.current = ShapeFactory.create(this.type);
    this.current.setStart(x, y);
    if (!this.current.needsDrag) this.finish(x, y);
  }

  move(x, y) {
    if (this.current) this.current.setEnd(x, y);
  }

  finish(x, y) {
    if (!this.current) return;
    this.current.setEnd(x, y);
    this.pcshape[this.count++] = this.current;
    this.current = null;
  }

  draw(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < this.count; i++) {
      this.pcshape[i].show(ctx);
    }
    if (this.current) this.current.showRubber(ctx);
  }
}

const editor = new MyEditor();