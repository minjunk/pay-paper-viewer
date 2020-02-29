import { dialog, BrowserWindow, SaveDialogReturnValue } from 'electron';

function savePdfDialog(title?: string): Promise<SaveDialogReturnValue> {
  const win = BrowserWindow.getFocusedWindow();
  return dialog.showSaveDialog(win, {
    defaultPath: `~/${title}.pdf`,
    filters: [
      { name: 'PDF', extensions: ['pdf'] },
    ],
  });
}

export default savePdfDialog;
