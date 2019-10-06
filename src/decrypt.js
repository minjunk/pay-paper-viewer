/* eslint-disable global-require */

let form;

function selectedFile(file, password) {
  const fileReader = new FileReader();
  fileReader.addEventListener('load', (event) => {
    const cheerio = require('cheerio');
    const $ = cheerio.load(event.target.result);
    const encrypted = $("input[name*='_viewData']").attr('value');

    try {
      let decrypted = require('./decryptPayPaper')(password, encrypted);

      // hack: force replace 'EUC-KR' => 'UTF-8'
      decrypted = decrypted.replace('EUC-KR', 'UTF-8');

      // blob
      const blob = new Blob([decrypted], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      window.location.href = url;
    } catch (e) {
      alert(e.message); // eslint-disable-line no-alert
      form.classList.remove('loading');
    }
  });
  fileReader.readAsBinaryString(file);
}

document.addEventListener('DOMContentLoaded', () => {
  form = document.getElementById('form');
  const file = document.getElementById('file');
  const password = document.getElementById('password');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    Array.from(document.querySelectorAll('.field.error'))
      .forEach(element => element.classList.remove('error'));

    const errors = [];
    if (!file.value) {
      errors.push(file);
    }

    const passwordValue = (password.value || '').replace(/^\S|\S$/g, '');
    if (!passwordValue) {
      errors.push(password);
    }

    if (errors.length > 0) {
      errors.forEach(element => element.parentElement.classList.add('error'));
      return;
    }

    form.classList.add('loading');
    selectedFile(file.files[0], password.value);
  });
}, false);
