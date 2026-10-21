const { openDialog } = require('./utils');

const html = `
<body style="font-family:sans-serif;padding:16px">
  <p>Крок 2 з 2</p>
  <div style="margin-top:40px;text-align:right">
    <button id="back">&lt; Назад</button>
    <button id="yes">Так</button>
    <button id="no">Відміна</button>
  </div>
  <script>
    const { ipcRenderer } = require('electron');
    document.getElementById('back').onclick = () => ipcRenderer.send('back');
    document.getElementById('yes').onclick = () => ipcRenderer.send('ok');
    document.getElementById('no').onclick = () => ipcRenderer.send('cancel');
  </script>
</body>`;

function show(parent, { onBack, onOk }) {
  const win = openDialog(parent, html, { title: 'Робота2: крок 2' });
  win.webContents.ipc.on('back', () => { onBack(); });
  win.webContents.ipc.on('ok', () => { win.close(); onOk(); });
  win.webContents.ipc.on('cancel', () => win.close());
}

module.exports = { show };