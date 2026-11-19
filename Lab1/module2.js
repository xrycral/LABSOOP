const { openDialog, onAction } = require('./utils');

const markup = `
  <p>Крок 1 з 2</p>
  <div class="buttons" style="margin-top:40px">
    <button type="button" data-action="next">Далі &gt;</button>
    <button type="button" data-action="cancel">Відміна</button>
  </div>`;

function show(parent, { onNext }) {
  const win = openDialog(parent, markup, { title: 'Робота2: крок 1' });
  onAction(win, (action) => {
    if (action === 'next') onNext();
    else if (action === 'cancel') win.close();
  });
}

module.exports = { show };