import fs from 'fs';
import { ipcRenderer, WebviewTag } from 'electron';
import decryptedFile from './decryptedFile';

let form: HTMLFormElement;

document.addEventListener('DOMContentLoaded', () => {
  // 암호화된 파일
  let encrypted: string;

  form = document.getElementById('form') as HTMLFormElement;
  const password = document.getElementById('password') as HTMLInputElement;
  const viewer = document.getElementById('viewer') as WebviewTag;

  // 첫 진입 시 로더 활성화
  form.classList.add('loading');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    Array.from(document.querySelectorAll('.field.error'))
      .forEach((element) => element.classList.remove('error'));

    const errors = [];
    if (!encrypted) {
      return;
    }

    const passwordValue = (password.value || '').replace(/^\s|\s$/g, '');
    if (!passwordValue) {
      errors.push(password);
    }

    if (errors.length > 0) {
      errors.forEach((element) => element.parentElement.classList.add('error'));
      return;
    }

    form.classList.add('loading');
    decryptedFile(passwordValue, encrypted);
  });

  viewer.addEventListener('dom-ready', () => {
    viewer.classList.add('show');
    form.classList.remove('loading');

    // 메인 프로세서에 '급여명세서'파일이 열렸음을 알린다.
    ipcRenderer.send('open-paper', {
      title: viewer.getTitle(),
    });
  });

  ipcRenderer.on('open-file', (_event, message) => {
    encrypted = message;
    form.classList.remove('loading');
    password.value = '';
    password.focus();
  });

  /**
   * '저장' 다이얼로그에서 저장 위치를 지정한 뒤에 `filePath`을 반환 받고
   * `fs`를 통해 PDF를 생성한 뒤에 파일을 해당 위치에 저장한다.
   */
  ipcRenderer.on('will-export-pdf-path', (_event, filePath) => {
    viewer.printToPDF({
      pageSize: 'A4',
    })
      .then((data) => fs.writeFileSync(filePath, data))
      .catch(() => {});
  });

  ipcRenderer.on('print-paper', () => {
    viewer.print();
  });
}, false);
