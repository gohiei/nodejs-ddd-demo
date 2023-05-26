import { hash as bCryptHash, compare as bCryptCompare } from 'bcrypt';
import * as crypto from 'crypto';

const AES_CIPHER_KEY = 'ya+BfSHRRiVcN7no';

export async function HashByBlowfish(data): Promise<string> {
  const hash: string = await bCryptHash(data, 10);
  return hash;
}

export async function CompareByBlowfish(data, hash): Promise<boolean> {
  const result: boolean = await bCryptCompare(data, hash);
  return result;
}

export function EncodeByAES128ECB(data, key = AES_CIPHER_KEY) {
  const bufferKey = Buffer.from(key, 'utf8');
  const iv = crypto.randomBytes(0);
  const cipher = crypto.createCipheriv('aes-128-ecb', bufferKey, iv);
  cipher.setAutoPadding(true);

  const chunks = [];
  chunks.push(cipher.update(data, 'utf8', 'base64'));
  chunks.push(cipher.final('base64'));

  return chunks.join('');
}

export function DecodeByAES128ECB(data, key = AES_CIPHER_KEY) {
  const bufferKey = Buffer.from(key, 'utf8');
  const iv = crypto.randomBytes(0);
  const decipher = crypto.createDecipheriv('aes-128-ecb', bufferKey, iv);
  decipher.setAutoPadding(true);

  const chunks = [];
  chunks.push(decipher.update(data, 'base64', 'utf8'));
  chunks.push(decipher.final('utf8'));

  return chunks.join('');
}
