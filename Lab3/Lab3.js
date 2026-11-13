const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');

const SHAPES = [
  { id: 'point', label: 'Крапка' },
  { id: 'line', label: 'Лінія' },
  { id: 'rect', label: 'Прямокутник' },
  { id: 'ellipse', label: 'Еліпс' }
];

class MainApp {
  constructor() {
    this.win = null;
    this.menu = null;
    this.currentId = 'point';
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
        submenu: SHAPES.map((s) => ({
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
      title: 'Lab3 – Графічний редактор об’єктів',
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
    if (SHAPES.some((s) => s.id === id)) this.onSelectShape(id);
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
      message: 'Lab3 – графічний редактор об’єктів',
      detail: 'Тип об’єкта обирається в меню «Об’єкти» або кнопками панелі інструментів.'
    });
  }
}

new MainApp().start();