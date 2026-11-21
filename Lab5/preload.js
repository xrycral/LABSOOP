const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('editorApi', {
  onShapeSelected: (callback) => ipcRenderer.on('shape-selected', (_event, id) => callback(id)),
  selectShape: (id) => ipcRenderer.send('select-shape', id),
  onHighlight: (callback) => ipcRenderer.on('highlight-shape', (_event, index) => callback(index)),
  onDelete: (callback) => ipcRenderer.on('delete-shape', (_event, index) => callback(index)),
  onLoad: (callback) => ipcRenderer.on('load-shapes', (_event, rows) => callback(rows)),
  sendRows: (rows) => ipcRenderer.send('rows-changed', rows)
});