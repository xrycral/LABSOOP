const TOOLS = [
  { id: 'point', tooltip: 'Крапка' },
  { id: 'line', tooltip: 'Лінія' },
  { id: 'rect', tooltip: 'Прямокутник' },
  { id: 'ellipse', tooltip: 'Еліпс' }
];

class EditorApp {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.workspace = document.getElementById('workspace');
    this.ctx = this.canvas.getContext('2d');
    this.editor = new MyEditor();
    this.toolbar = new Toolbar(document.getElementById('toolbar'), TOOLS, (id) => this.onToolSelected(id));

    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    window.addEventListener('resize', () => this.onResize());
    window.editorApi.onShapeSelected((id) => this.onShapeSelected(id));

    this.onResize();
  }

  redraw() {
    this.editor.draw(this.ctx, this.canvas.width, this.canvas.height);
  }

  position(event) {
    const rect = this.canvas.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  onMouseDown(event) {
    if (event.button !== 0) return;
    const [x, y] = this.position(event);
    this.editor.start(x, y);
    this.redraw();
  }

  onMouseMove(event) {
    if (!this.editor.isDrawing) return;
    const [x, y] = this.position(event);
    this.editor.move(x, y);
    this.redraw();
  }

  onMouseUp(event) {
    if (!this.editor.isDrawing) return;
    const [x, y] = this.position(event);
    this.editor.finish(x, y);
    this.redraw();
  }

  onResize() {
    this.canvas.width = this.workspace.clientWidth;
    this.canvas.height = this.workspace.clientHeight;
    this.redraw();
  }

  onToolSelected(id) {
    window.editorApi.selectShape(id);
  }

  onShapeSelected(id) {
    this.editor.setType(id);
    this.toolbar.setActive(id);
  }
}

new EditorApp();