const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const { SHAPE_TYPES } = require('./shape-types');
const { serializeShapes, parseShapes } = require('./shapes-file');

const MAX_FILE_SIZE = 1000000;
const MAX_ROWS = 1000;

class MainApp {
  constructor() {
    this.win = null;
    this.tableWin = null;
    this.menu = null;
    this.currentId = SHAPE_TYPES[0].id;
    this.rows = [];
  }

  start() {
    app.whenReady().then(() => this.onReady());
    app.on('window-all-closed', () => this.onAllWindowsClosed());
    ipcMain.on('select-shape', (_event, id) => this.onSelectShapeRequest(id));
    ipcMain.on('rows-changed', (event, rows) => this.onRowsChanged(event.sender, rows));
    ipcMain.on('table-select', (event, index) => this.onTableSelect(event.sender, index));
    ipcMain.on('table-delete', (event, index) => this.onTableDelete(event.sender, index));
  }

  isTableOpen() {
    return this.tableWin !== null && !this.tableWin.isDestroyed();
  }

  isFrom(sender, win) {
    return win !== null && !win.isDestroyed() && win.webContents === sender;
  }

  buildMenu() {
    return Menu.buildFromTemplate([
      {
        label: 'Файл',
        submenu: [
          { label: 'Відкрити…', click: () => this.onOpen() },
          { label: 'Зберегти…', click: () => this.onSave() },
          { type: 'separator' },
          { label: 'Вихід', role: 'quit' }
        ]
      },
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
      {
        label: 'Вікно',
        submenu: [{
          id: 'table',
          label: 'Таблиця об’єктів',
          type: 'checkbox',
          checked: this.isTableOpen(),
          click: () => this.onToggleTable()
        }]
      },
      { label: 'Довідка', submenu: [{ label: 'Про програму', click: () => this.onShowAbout() }] }
    ]);
  }

  refreshMenu() {
    this.menu = this.buildMenu();
    Menu.setApplicationMenu(this.menu);
  }

  secureOptions(preloadFile) {
    return {
      preload: path.join(__dirname, preloadFile),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    };
  }

  createWindow() {
    this.win = new BrowserWindow({
      width: 900,
      height: 650,
      show: false,
      title: 'Lab5 – Графічний редактор об’єктів',
      webPreferences: this.secureOptions('preload.js')
    });
    this.win.on('page-title-updated', (e) => e.preventDefault());
    this.win.once('ready-to-show', () => this.win.show());
    this.win.on('closed', () => this.onMainClosed());
    this.win.webContents.on('did-finish-load', () => this.onSelectShape(this.currentId));
    this.win.loadFile('index.html');
  }

  openTable() {
    if (this.isTableOpen()) {
      this.tableWin.focus();
      return;
    }
    this.tableWin = new BrowserWindow({
      parent: this.win,
      modal: false,
      width: 460,
      height: 520,
      show: false,
      title: 'Таблиця об’єктів',
      webPreferences: this.secureOptions('table-preload.js')
    });
    this.tableWin.setMenuBarVisibility(false);
    this.tableWin.once('ready-to-show', () => this.tableWin.show());
    this.tableWin.on('closed', () => this.onTableClosed());
    this.tableWin.webContents.on('did-finish-load', () => this.sendRowsToTable());
    this.tableWin.loadFile('table.html');
    this.refreshMenu();
  }

  closeTable() {
    if (this.isTableOpen()) this.tableWin.close();
  }

  sendRowsToTable() {
    if (this.isTableOpen()) this.tableWin.webContents.send('table-rows', this.rows);
  }

  cleanRows(rows) {
    if (!Array.isArray(rows) || rows.length > MAX_ROWS) return null;
    const clean = [];
    for (const row of rows) {
      if (!row || typeof row.type !== 'string' || typeof row.label !== 'string') return null;
      const coords = [row.x1, row.y1, row.x2, row.y2];
      if (!coords.every(Number.isFinite)) return null;
      clean.push({ type: row.type, label: row.label, x1: row.x1, y1: row.y1, x2: row.x2, y2: row.y2 });
    }
    return clean;
  }

  onReady() {
    this.refreshMenu();
    this.createWindow();
  }

  onAllWindowsClosed() {
    app.quit();
  }

  onMainClosed() {
    this.closeTable();
  }

  onTableClosed() {
    this.tableWin = null;
    this.refreshMenu();
  }

  onToggleTable() {
    if (this.isTableOpen()) this.closeTable();
    else this.openTable();
  }

  onSelectShapeRequest(id) {
    if (typeof id === 'string' && SHAPE_TYPES.some((s) => s.id === id)) this.onSelectShape(id);
  }

  onSelectShape(id) {
    this.currentId = id;
    this.refreshMenu();
    this.win.webContents.send('shape-selected', id);
  }

  onRowsChanged(sender, rows) {
    if (!this.isFrom(sender, this.win)) return;
    const clean = this.cleanRows(rows);
    if (!clean) return;
    this.rows = clean;
    this.sendRowsToTable();
  }

  onTableSelect(sender, index) {
    if (this.isFrom(sender, this.tableWin) && Number.isInteger(index)) {
      this.win.webContents.send('highlight-shape', index);
    }
  }

  onTableDelete(sender, index) {
    if (this.isFrom(sender, this.tableWin) && Number.isInteger(index)) {
      this.win.webContents.send('delete-shape', index);
    }
  }

  async onSave() {
    const result = await dialog.showSaveDialog(this.win, {
      title: 'Зберегти об’єкти',
      defaultPath: 'shapes.txt',
      filters: [{ name: 'Текстові файли', extensions: ['txt'] }]
    });
    if (result.canceled || !result.filePath) return;
    try {
      await fs.writeFile(result.filePath, serializeShapes(this.rows), 'utf8');
    } catch (error) {
      dialog.showErrorBox('Помилка', 'Не вдалося зберегти файл');
    }
  }

  async onOpen() {
    const result = await dialog.showOpenDialog(this.win, {
      title: 'Відкрити файл з об’єктами',
      properties: ['openFile'],
      filters: [{ name: 'Текстові файли', extensions: ['txt'] }]
    });
    if (result.canceled || result.filePaths.length === 0) return;
    try {
      const file = result.filePaths[0];
      const info = await fs.stat(file);
      if (info.size > MAX_FILE_SIZE) throw new Error('Файл завеликий');
      const text = await fs.readFile(file, 'utf8');
      const rows = parseShapes(text, SHAPE_TYPES.map((s) => s.id));
      this.win.webContents.send('load-shapes', rows);
    } catch (error) {
      dialog.showErrorBox('Помилка', 'Не вдалося відкрити файл');
    }
  }

  onShowAbout() {
    dialog.showMessageBox(this.win, {
      type: 'info',
      title: 'Довідка',
      message: 'Lab5 – графічний редактор об’єктів',
      detail: 'Тип об’єкта обирається в меню «Об’єкти» або кнопками панелі інструментів. Таблиця об’єктів відкривається в меню «Вікно».'
    });
  }
}

new MainApp().start();