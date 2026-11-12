const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

const SHAPES = [
  { id: 'point', label: 'Крапка' },
  { id: 'line', label: 'Лінія' },
  { id: 'rect', label: 'Прямокутник' },
  { id: 'ellipse', label: 'Еліпс' }
];

let mainWin;
let currentId = 'point';

function titleFor(id) {
  const shape = SHAPES.find((s) => s.id === id);
  return `Lab2 – Поточний об’єкт: ${shape.label}`;
}

function selectShape(id) {
  currentId = id;
  mainWin.setTitle(titleFor(id));
  mainWin.webContents.send('shape-selected', id);
}

function showAbout() {
  dialog.showMessageBox(mainWin, {
    type: 'info',
    title: 'Довідка',
    message: 'Lab2 – графічний редактор об’єктів',
    detail: 'Обрати тип об’єкта в меню «Об’єкти» і малювати мишкою в робочій області.'
  });
}

function buildMenu() {
  return Menu.buildFromTemplate([
    { label: 'Файл', submenu: [{ label: 'Вихід', role: 'quit' }] },
    {
      label: 'Об’єкти',
      submenu: SHAPES.map((s) => ({ label: s.label, click: () => selectShape(s.id) }))
    },
    { label: 'Довідка', submenu: [{ label: 'Про програму', click: showAbout }] }
  ]);
}

function createWindow() {
  mainWin = new BrowserWindow({
    width: 900,
    height: 600,
    show: false,
    title: titleFor(currentId),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWin.on('page-title-updated', (e) => e.preventDefault());
  mainWin.once('ready-to-show', () => mainWin.show());
  mainWin.webContents.on('did-finish-load', () => selectShape(currentId));
  mainWin.loadFile('index.html');
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(buildMenu());
  createWindow();
});

app.on('window-all-closed', () => app.quit());
