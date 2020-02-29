import { WebviewTag } from 'electron';
import decryptPayPaper from './decryptPayPaper';

function decryptedFile(password: string, encrypted: string): void {
  let decrypted = decryptPayPaper(password, encrypted);

  // hack: force replace 'EUC-KR' => 'UTF-8'
  decrypted = decrypted.replace('EUC-KR', 'UTF-8');

  // blob
  const blob = new Blob([decrypted], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const viewer = document.getElementById('viewer') as WebviewTag;
  viewer.setAttribute('src', url);
}

export default decryptedFile;
