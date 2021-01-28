import crypto from 'crypto';

function sha256hash(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export { sha256hash };
