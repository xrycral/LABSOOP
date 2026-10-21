const { app, BrowserWindow, Menu } = require('electron');
const module1 = require('./module1');
const module2 = require('./module2');
const module3 = require('./module3');

let mainWin;

function showResult(text) {
  mainWin.webContents.executeJavaScript(
    `document.getElementById('result').textContent = ${JSON.stringify(text)};`
  );
}

function work1() {
  module1.show(mainWin, (n) => showResult(`Робота1: обране число ${n}`));
}

function work2() {
  const step1 = () => module2.show(mainWin, { onNext: step2 });
  const step2 = () => module3.show(mainWin, {
    onBack: step1,
    onOk: () => showResult('Робота2: підтверджено')
  });
  step1();
}

app.whenReady().then(() => {
  mainWin = new BrowserWindow({ width: 800, height: 600, title: 'Lab1' });
  mainWin.loadFile('index.html');

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'Робота1', click: work1 },
    { label: 'Робота2', click: work2 }
  ]));
});

app.on('window-all-closed', () => app.quit());