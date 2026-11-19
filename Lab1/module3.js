const { openDialog, onAction } = require('./utils');

const markup = `
  <p>Крок 2 з 2</p>
  <div class="buttons" style="margin-top:40px">
    <button type="button" data-action="back">&lt; Назад</button>
    <button type="button" data-action="ok">Так</button>
    <button type="button" data-action="cancel">Відміна</button>
  </div>`;

function show(parent, { onBack, onOk }) {
  const win = openDialog(parent, markup, { title: 'Робота2: крок 2' });
  onAction(win, (action) => {
    if (action === 'back') {
      onBack();
    } else if (action === 'ok') {
      win.close();
      onOk();
    } else if (action === 'cancel') {
      win.close();
    }
  });
}

module.exports = { show };