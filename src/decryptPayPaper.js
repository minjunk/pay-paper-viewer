/**
 * 이 파일은 아래 블로그의 글을 바탕으로 작성되었습니다.
 * https://enghqii.tistory.com/42
 */

const crypto = require('crypto');
const { Iconv } = require('iconv');

/* eslint-disable no-param-reassign */

function hashSaltPassword(salt, password) {
  const hash = crypto.createHash('SHA1');
  hash.update(password);
  hash.update(salt);
  const saltedKey = hash.digest().slice(0, 16);
  return saltedKey;
}

module.exports = function decryptPayPaper(password, encrypted) {
  // read blob from base64 encoded string
  const blob = Buffer.from(encrypted, 'base64');

  // find Initialization Vector, Salt, Content from Encrypted blob
  // ref : http://www.jensign.com/JavaScience/dotnet/DeriveBytes/
  const IV = blob.slice(56 + 2, 56 + 2 + 8);
  const salt = blob.slice(66 + 2, 66 + 2 + 16);
  const content = blob.slice(84 + 4, blob.length);

  // convert password into UNICODE string
  const iconvPassword = new Iconv('utf-8', 'UTF-16LE');
  password = Buffer.from(password);
  password = iconvPassword.convert(password);

  const key = hashSaltPassword(salt, password);

  // decrypt
  const decipher = crypto.createDecipheriv('rc2-cbc', key, IV);
  const decrypted1 = decipher.update(content);
  const decrypted2 = decipher.final();

  const decrypted = Buffer.concat([decrypted1, decrypted2]);

  // convert 'decrypted' to utf8 string, from utf-16 Little Endian
  const iconvConvert = new Iconv('UTF-16LE', 'utf-8');
  const decryptedUtf8 = iconvConvert.convert(decrypted).toString();

  return decryptedUtf8;
};
