import fs from 'fs';
import { dialog, BrowserWindow } from 'electron';
import getEncryptedData from '../lib/getEncryptedData';

async function openFileDialog(win: BrowserWindow): Promise<string | null> {
  try {
    const result = await dialog.showOpenDialog(win, {
      title: '급여명세서 파일 선택',
      properties: ['openFile'],
      filters: [
        { name: 'HTML 파일', extensions: ['htm'] },
      ],
    });

    const filePath = result.filePaths[0];
    const fileData = fs.readFileSync(filePath).toString();
    const encrypted = getEncryptedData(fileData);
    if (!encrypted) {
      dialog.showMessageBoxSync(win, {
        type: 'error',
        message: '급여명세서 파일 형식이 아닙니다. 다시 시도 해 주세요.',
      });
      return null;
    }

    return encrypted;
  } catch (error) {
    return null;
  }
}

export default openFileDialog;
