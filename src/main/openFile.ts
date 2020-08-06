import { BrowserWindow, WebContents } from 'electron';
import openFileDialog from './openFileDialog';
import decryptedFile from '../lib/decryptedFile';

export async function openFile(sender: WebContents, password: string): Promise<string> {
  const win = BrowserWindow.fromWebContents(sender);
  const encrypted = await openFileDialog(win);
  return decryptedFile(password, encrypted);
}

export default openFile;
