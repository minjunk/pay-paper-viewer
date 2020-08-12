import {
  app, dialog, ipcMain, BrowserWindow, Menu,
} from 'electron';
import createWindow from './createWindow';
import appMenu, { switchPaperActionMenu } from './appMenu';
import openFile from './openFile';

// 메뉴바
const menu = appMenu(app.name);
Menu.setApplicationMenu(menu);

// 앱 실행
app.whenReady()
  .then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  switchPaperActionMenu();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('open-paper', (event, { title }: { title: string }) => {
  switchPaperActionMenu({
    title,
    exportPdf(filePath) {
      event.reply('will-export-pdf-path', filePath);
    },
    print() {
      event.reply('will-print-paper');
    },
  });
});

ipcMain.on('open-file', (event, password) => {
  openFile(event.sender, password)
    .then((decrypted) => {
      event.reply('decrypted-file', decrypted);
    })
    .catch(() => {
      const win = BrowserWindow.fromWebContents(event.sender);
      dialog.showMessageBox(win, {
        type: 'error',
        message: '급여명세서 파일을 열지 못했습니다. 다시 시도 해 주세요.',
      });
      event.reply('open-file-error');
    });
});

app.allowRendererProcessReuse = true;
