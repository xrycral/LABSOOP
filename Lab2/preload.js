const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('editorApi', {
  onShapeSelected: (callback) =>
    ipcRenderer.on('shape-selected', (_event, id) => callback(id))
});
