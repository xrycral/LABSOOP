const VARIANT = 21;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const editor = new MyEditor(VARIANT + 100);

function redraw() {
  editor.draw(ctx, canvas.width, canvas.height);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redraw();
}

function position(event) {
  const rect = canvas.getBoundingClientRect();
  return [event.clientX - rect.left, event.clientY - rect.top];
}

canvas.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;
  const [x, y] = position(e);
  editor.start(x, y);
  redraw();
});

canvas.addEventListener('mousemove', (e) => {
  if (!editor.isDrawing) return;
  const [x, y] = position(e);
  editor.move(x, y);
  redraw();
});

window.addEventListener('mouseup', (e) => {
  if (!editor.isDrawing) return;
  const [x, y] = position(e);
  editor.finish(x, y);
  redraw();
});

window.addEventListener('resize', resize);
window.editorApi.onShapeSelected((id) => editor.setType(id));
resize();
