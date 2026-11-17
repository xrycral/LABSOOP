const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const { SHAPE_TYPES } = require('./shape-types');

class MainApp {
  constructor() {
    this.win = null;
    this.menu = null;
    this.currentId = SHAPE_TYPES[0].id;
  }

  start() {
    app.whenReady().then(() => this.onReady());
    app.on('window-all-closed', () => this.onAllWindowsClosed());
    ipcMain.on('select-shape', (_event, id) => this.onSelectShapeRequest(id));
  }

  buildMenu() {
    return Menu.buildFromTemplate([
      { label: 'Файл', submenu: [{ label: 'Вихід', role: 'quit' }] },
      {
        label: 'Об’єкти',
        submenu: SHAPE_TYPES.map((s) => ({
          id: 'shape-' + s.id,
          label: s.label,
          type: 'radio',
          checked: s.id === this.currentId,
          click: () => this.onSelectShape(s.id)
        }))
      },
      { label: 'Довідка', submenu: [{ label: 'Про програму', click: () => this.onShowAbout() }] }
    ]);
  }

  createWindow() {
    this.win = new BrowserWindow({
      width: 900,
      height: 650,
      show: false,
      title: 'Lab4 – Графічний редактор об’єктів',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    });
    this.win.on('page-title-updated', (e) => e.preventDefault());
    this.win.once('ready-to-show', () => this.win.show());
    this.win.webContents.on('did-finish-load', () => this.onSelectShape(this.currentId));
    this.win.loadFile('index.html');
  }

  onReady() {
    this.menu = this.buildMenu();
    Menu.setApplicationMenu(this.menu);
    this.createWindow();
  }

  onAllWindowsClosed() {
    app.quit();
  }

  onSelectShapeRequest(id) {
    if (typeof id === 'string' && SHAPE_TYPES.some((s) => s.id === id)) this.onSelectShape(id);
  }

  onSelectShape(id) {
    this.currentId = id;
    this.updateMenuMarks();
    this.win.webContents.send('shape-selected', id);
  }

  updateMenuMarks() {
    this.menu = this.buildMenu();
    Menu.setApplicationMenu(this.menu);
  }

  onShowAbout() {
    dialog.showMessageBox(this.win, {
      type: 'info',
      title: 'Довідка',
      message: 'Lab4 – графічний редактор об’єктів',
      detail: 'Тип об’єкта обирається в меню «Об’єкти» або кнопками панелі інструментів.'
    });
  }
}

new MainApp().start();