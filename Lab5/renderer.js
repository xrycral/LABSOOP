class EditorApp {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.workspace = document.getElementById('workspace');
    this.ctx = this.canvas.getContext('2d');
    this.editor = MyEditor.getInstance();
    this.toolbar = new Toolbar(document.getElementById('toolbar'), SHAPE_TYPES, (id) => this.onToolSelected(id));

    this.editor.addListener(() => this.onEditorChanged());
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    window.addEventListener('resize', () => this.onResize());
    window.editorApi.onShapeSelected((id) => this.onShapeSelected(id));
    window.editorApi.onHighlight((index) => this.onHighlight(index));
    window.editorApi.onDelete((index) => this.onDelete(index));
    window.editorApi.onLoad((rows) => this.onLoad(rows));

    this.onResize();
  }

  redraw() {
    this.editor.draw(this.ctx, this.canvas.width, this.canvas.height);
  }

  position(event) {
    const rect = this.canvas.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  labelOf(type) {
    const item = SHAPE_TYPES.find((s) => s.id === type);
    return item ? item.label : type;
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

  onEditorChanged() {
    const rows = this.editor.describe().map((row) => ({ ...row, label: this.labelOf(row.type) }));
    window.editorApi.sendRows(rows);
    this.redraw();
  }

  onHighlight(index) {
    this.editor.select(index);
    this.redraw();
  }

  onDelete(index) {
    this.editor.remove(index);
  }

  onLoad(rows) {
    this.editor.load(rows);
  }
}

new EditorApp();