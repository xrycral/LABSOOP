const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tableApi', {
  onRows: (callback) => ipcRenderer.on('table-rows', (_event, rows) => callback(rows)),
  select: (index) => ipcRenderer.send('table-select', index),
  remove: (index) => ipcRenderer.send('table-delete', index)
});