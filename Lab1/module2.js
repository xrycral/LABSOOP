const { openDialog } = require('./utils');

const html = `
<body style="font-family:sans-serif;padding:16px">
  <p>Крок 1 з 2</p>
  <div style="margin-top:40px;text-align:right">
    <button id="next">Далі &gt;</button>
    <button id="no">Відміна</button>
  </div>
  <script>
    const { ipcRenderer } = require('electron');
    document.getElementById('next').onclick = () => ipcRenderer.send('next');
    document.getElementById('no').onclick = () => ipcRenderer.send('cancel');
  </script>
</body>`;

function show(parent, { onNext }) {
  const win = openDialog(parent, html, { title: 'Робота2: крок 1' });
  win.webContents.ipc.on('next', () => { onNext(); });
  win.webContents.ipc.on('cancel', () => win.close());
}

module.exports = { show };