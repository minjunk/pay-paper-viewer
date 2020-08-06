import decryptPayPaper from './decryptPayPaper';

function decryptedFile(password: string, encrypted: string): string {
  let decrypted = decryptPayPaper(password, encrypted);

  // hack: force replace 'EUC-KR' => 'UTF-8'
  decrypted = decrypted.replace('EUC-KR', 'UTF-8');

  return decrypted;
}

export default decryptedFile;
