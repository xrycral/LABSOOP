const { openDialog } = require('./utils');

const html = `
<body style="font-family:sans-serif;padding:16px">
  <p>Оберіть число (1–100): <b id="v">50</b></p>
  <input type="range" id="s" min="1" max="100" value="50" style="width:100%">
  <div style="margin-top:20px;text-align:right">
    <button id="yes">Так</button>
    <button id="no">Відміна</button>
  </div>
  <script>
    const { ipcRenderer } = require('electron');
    const s = document.getElementById('s');
    const v = document.getElementById('v');
    s.oninput = () => { v.textContent = s.value; };
    document.getElementById('yes').onclick = () => ipcRenderer.send('ok', Number(s.value));
    document.getElementById('no').onclick = () => ipcRenderer.send('cancel');
  </script>
</body>`;

function show(parent, onOk) {
  const win = openDialog(parent, html, { title: 'Робота1' });
  win.webContents.ipc.on('ok', (e, value) => { win.close(); onOk(value); });
  win.webContents.ipc.on('cancel', () => win.close());
}

module.exports = { show };