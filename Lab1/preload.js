const { ipcRenderer } = require('electron');

ipcRenderer.on('show-result', (_event, text) => {
  document.getElementById('result').textContent = String(text);
});