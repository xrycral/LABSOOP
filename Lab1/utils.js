const { BrowserWindow } = require('electron');

let current = null;

function openDialog(parent, html, { width = 400, height = 220, title = '' } = {}) {
  if (current && !current.isDestroyed()) current.close();

  const win = new BrowserWindow({
    parent, modal: true, width, height, title,
    resizable: false, minimizable: false, maximizable: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  win.setMenuBarVisibility(false);
  win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
  current = win;
  return win;
}

module.exports = { openDialog };