import { notification } from 'antd';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const VISION = path.join(__dirname, 'assets', 'vision');

function sha256hash(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function loadScript(name: string, pack: 'builtin' | 'custom' | 'templates') {
  const pyPath = path.join(VISION, pack, `${name}.py`);
  let script;
  try {
    script = fs.readFileSync(pyPath, 'utf8');
  } catch (e) {
    // TODO defaults to "" or __template__.py?
    script = '';
  }
  return script;
}

function notify(
  type: 'success' | 'info' | 'warning' | 'error',
  message: string,
  description = ''
) {
  notification[type]({
    message,
    description,
  });
}
export { sha256hash, loadScript, notify };
