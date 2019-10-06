const { app, shell, BrowserWindow } = require('electron');

let win;

function createWindow() {
  // 브라우저 창을 생성합니다.
  win = new BrowserWindow({
    width: 658,
    height: 1001,
    title: '와디즈 급여명세서 뷰어',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('src/index.html');

  // 창이 닫힐 때 발생합니다
  win.on('closed', () => {
    win = null;
  });

  // 새창을 열 때 외부 웹브라우저로 연다.
  win.webContents.on('new-window', function (event, url) {
    event.preventDefault();
    shell.openExternal(url);
  })
}

app.on('ready', createWindow);

// 모든 창이 닫혔을 때 종료.
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
