import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export function generateApiKey() {
  const plainKey = `ih_${crypto.randomBytes(32).toString('hex')}`;
  const prefix = plainKey.slice(0, 11);
  return { plainKey, prefix };
}

export async function hashApiKey(plainKey) {
  return bcrypt.hash(plainKey, 12);
}

export async function verifyApiKey(plainKey, hash) {
  return bcrypt.compare(plainKey, hash);
}

export default { generateApiKey, hashApiKey, verifyApiKey };
