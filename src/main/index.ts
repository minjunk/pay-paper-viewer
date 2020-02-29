import {
  app, ipcMain, BrowserWindow, Menu,
} from 'electron';
import createWindow from './createWindow';
import appMenu, { switchPaperActionMenu } from './appMenu';

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
      event.reply('print-paper');
    },
  });
});

app.allowRendererProcessReuse = true;
