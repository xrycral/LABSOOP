const { openDialog, onAction } = require('./utils');

const markup = `
  <p>Оберіть число (1–100): <b id="v">50</b></p>
  <input type="range" name="value" min="1" max="100" value="50" data-output="v" style="width:100%">
  <div class="buttons">
    <button type="button" data-action="ok">Так</button>
    <button type="button" data-action="cancel">Відміна</button>
  </div>`;

function show(parent, onOk) {
  const win = openDialog(parent, markup, { title: 'Робота1' });
  onAction(win, (action, values) => {
    if (action === 'cancel') {
      win.close();
    } else if (action === 'ok') {
      const value = Number(values.value);
      if (!Number.isInteger(value) || value < 1 || value > 100) return;
      win.close();
      onOk(value);
    }
  });
}

module.exports = { show };