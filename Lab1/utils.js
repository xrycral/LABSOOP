const { BrowserWindow } = require('electron');
const path = require('path');

let current = null;

function buildPage(body) {
  return `<!DOCTYPE html>
<html lang="uk">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'">
    <style>
      body { font-family: sans-serif; padding: 16px; }
      .buttons { margin-top: 20px; text-align: right; }
    </style>
  </head>
  <body>${body}</body>
</html>`;
}

function openDialog(parent, body, { width = 400, height = 220, title = '' } = {}) {
  if (current && !current.isDestroyed()) current.close();

  const win = new BrowserWindow({
    parent, modal: true, width, height, title,
    show: false,
    resizable: false, minimizable: false, maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'dialog.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.setMenuBarVisibility(false);
  win.once('ready-to-show', () => win.show());
  win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(buildPage(body)));
  current = win;
  return win;
}

function onAction(win, handler) {
  win.webContents.ipc.on('dialog-action', (_event, action, values) => handler(action, values));
}

module.exports = { openDialog, onAction };