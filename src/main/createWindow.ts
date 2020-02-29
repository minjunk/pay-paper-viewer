import { shell, BrowserWindow } from 'electron';
import openFileDialog from './openFileDialog';

function createWindow(): void {
  // 브라우저 창을 생성합니다.
  const win = new BrowserWindow({
    width: 658,
    height: 1001,
    title: '급여명세서 뷰어',
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      webgl: false,
    },
  });

  // 비밀번호 입력 페이지를 연다.
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile('build/app.html');
  }
  openFileDialog(win);

  // 새창을 열 때 외부 웹브라우저로 연다.
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // 개발자 도구를 엽니다.
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools({
      mode: 'detach',
    });
  }
}

export default createWindow;
