const VARIANT = 21;
const N = VARIANT + 100;

const CREATE_KEY = Symbol('MyEditor');

class MyEditor {
  static getInstance = (() => {
    let instance;
    return () => {
      instance ??= new MyEditor(CREATE_KEY);
      return instance;
    };
  })();

  constructor(key) {
    if (key !== CREATE_KEY) {
      throw new Error('MyEditor – Singleton: використовуйте MyEditor.getInstance()');
    }
    this.pcshape = new Array(N).fill(null);
    this.count = 0;
    this.type = 'point';
    this.current = null;
    this.selectedIndex = -1;
    this.listeners = [];
  }

  get capacity() { return N; }
  get isDrawing() { return this.current !== null; }

  addListener(listener) {
    this.listeners.push(listener);
  }

  notify() {
    for (const listener of this.listeners) listener();
  }

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
    this.selectedIndex = -1;
    this.notify();
  }

  select(index) {
    this.selectedIndex = Number.isInteger(index) && index >= 0 && index < this.count ? index : -1;
  }

  remove(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.count) return false;
    for (let i = index; i < this.count - 1; i++) this.pcshape[i] = this.pcshape[i + 1];
    this.pcshape[--this.count] = null;
    this.selectedIndex = -1;
    this.notify();
    return true;
  }

  load(rows) {
    this.pcshape.fill(null);
    this.count = 0;
    this.current = null;
    this.selectedIndex = -1;
    for (const row of rows) {
      if (this.count >= N) break;
      const coords = [row.x1, row.y1, row.x2, row.y2];
      if (!ShapeFactory.has(row.type) || !coords.every(Number.isFinite)) continue;
      const shape = ShapeFactory.create(row.type);
      shape.setStart(row.x1, row.y1);
      shape.setEnd(row.x2, row.y2);
      this.pcshape[this.count++] = shape;
    }
    this.notify();
  }

  describe() {
    const round = (v) => Math.round(v * 100) / 100;
    const rows = [];
    for (let i = 0; i < this.count; i++) {
      const s = this.pcshape[i];
      rows.push({ type: s.typeId, x1: round(s.x1), y1: round(s.y1), x2: round(s.x2), y2: round(s.y2) });
    }
    return rows;
  }

  draw(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < this.count; i++) {
      this.pcshape[i].show(ctx);
    }
    if (this.selectedIndex >= 0) this.pcshape[this.selectedIndex].showSelected(ctx);
    if (this.current) this.current.showRubber(ctx);
  }
}