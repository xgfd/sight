import { notification } from 'antd';
import crypto from 'crypto';
import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';

const VISION = path.join(__dirname, 'assets', 'vision');
const BUILTIN = path.join(VISION, 'builtin');
const CUSTOM = path.join(VISION, 'custom');

function sha256hash(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function listScripts() {
  const builtin = fg
    .sync('*.py', { cwd: BUILTIN, ignore: ['__*.py'] })
    .map((fileName) => fileName.split('.')[0]);
  const custom = fg
    .sync('*.py', { cwd: CUSTOM, ignore: ['__*.py'] })
    .map((fileName) => fileName.split('.')[0]);
  return { builtin, custom };
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
export { sha256hash, loadScript, listScripts, notify };
