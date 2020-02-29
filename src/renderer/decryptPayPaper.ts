import crypto from 'crypto';
import iconv from 'iconv-lite';

/* eslint-disable no-param-reassign */

function hashSaltPassword(salt: Buffer, password: string): Buffer {
  const encodePassword = iconv.encode(password, 'UTF-16LE');
  const hash = crypto.createHash('SHA1');
  hash.update(encodePassword);
  hash.update(salt);
  const saltedKey = hash.digest().slice(0, 16);
  return saltedKey;
}
/**
 * 해당 메서드는 아래 블로그의 글을 바탕으로 작성되었습니다.
 * https://enghqii.tistory.com/42
 */
function decryptPayPaper(password: string, encrypted: string): string {
  // read blob from base64 encoded string
  const blob = Buffer.from(encrypted, 'base64');

  // find Initialization Vector, Salt, Content from Encrypted blob
  // ref : http://www.jensign.com/JavaScience/dotnet/DeriveBytes/
  const IV = blob.slice(56 + 2, 56 + 2 + 8);
  const salt = blob.slice(66 + 2, 66 + 2 + 16);
  const content = blob.slice(84 + 4, blob.length);

  const key = hashSaltPassword(salt, password);

  // decrypt
  const decipher = crypto.createDecipheriv('rc2-cbc', key, IV);
  const decrypted1 = decipher.update(content);
  const decrypted2 = decipher.final();

  const decrypted = Buffer.concat([decrypted1, decrypted2]);

  // convert 'decrypted' to utf8 string, from utf-16 Little Endian
  const decryptedUtf8 = iconv.decode(decrypted, 'UTF-16LE');

  return decryptedUtf8;
}

export default decryptPayPaper;
