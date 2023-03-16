/**
 * AES加密工具类
 */
import CryptoJS from "crypto-js";

const keyStr = "f95aaa3bcb6ea081e49c9cc872246d98"; // AES加密密钥，不要随意修改，修改需要告诉后端

// 加密
export function encrypt(word: string): string {
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

// 解密
export function decrypt(word: string): string {
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
