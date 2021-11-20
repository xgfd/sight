import fs from 'fs';
import os from 'os';
import path from 'path';
import { PythonShell } from 'python-shell';

const VISION =
  process.env.NODE_ENV !== 'development'
    ? path.join(process.resourcesPath, 'vision')
    : path.join(__dirname, '..', 'vision');

const BUILTIN = path.join(VISION, 'builtin');
const CUSTOM = path.join(VISION, 'custom');
const TEMPLATES = path.join(VISION, 'templates');

// the following folders must point to the same locations in vision/engine.py
const APP_DATA = path.join(os.homedir(), '.sight');
const IMAGE_CACHE = path.join(APP_DATA, 'cache');

let PY_PATH = '';

function getPyPath(cb: (pyPath: string) => void) {
  if (PY_PATH !== '') {
    cb(PY_PATH);
  } else {
    PythonShell.runString(
      'import sys; print(sys.executable)',
      {
        mode: 'text' as const,
        // pythonOptions: ['-u'], // get print results in real-time
        // scriptPath: VISION,
        env: {
          ...process.env,
          PYTHONIOENCODING: 'utf8',
        },
        cwd: VISION,
      },
      (err, res) => {
        if (err) {
          /* eslint-disable-next-line no-console */
          console.error(err);
          cb('Could not find Python path');
        } else {
          /* eslint-disable-next-line prefer-destructuring */
          PY_PATH = (res as string[])[0];
          cb(PY_PATH);
        }
      }
    );
  }
}

fs.mkdir(IMAGE_CACHE, { recursive: true }, (err) => {
  /* eslint-disable-next-line no-console */
  if (err) console.error(err);
});

export { VISION, BUILTIN, TEMPLATES, CUSTOM, IMAGE_CACHE, getPyPath };
