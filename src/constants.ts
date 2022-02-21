import log from 'electron-log';
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
const CONFIG_PATH = path.join(APP_DATA, 'settings.json');

const DEFAULT_CONFIG = { PY_PATH: '' };
let CONFIG = DEFAULT_CONFIG;

function getPyPath(cb: (pyPath: string) => void) {
  let { PY_PATH } = CONFIG;
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

function loadConfig() {
  try {
    CONFIG = {
      ...DEFAULT_CONFIG,
      ...JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')),
    };
  } catch (err) {
    log.warn(err);
  }
}

function updateConfig(config: any) {
  try {
    CONFIG = { ...CONFIG, ...config };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(CONFIG));
  } catch (err) {
    log.warn(err);
  }
}

function initConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    CONFIG = DEFAULT_CONFIG;
    try {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG));
    } catch (err) {
      log.warn(err);
    }
  } else {
    loadConfig();
  }
}

fs.mkdir(IMAGE_CACHE, { recursive: true }, (err) => {
  /* eslint-disable-next-line no-console */
  if (err) console.error(err);
});

initConfig();

export {
  VISION,
  BUILTIN,
  TEMPLATES,
  CUSTOM,
  IMAGE_CACHE,
  getPyPath,
  updateConfig,
  loadConfig,
};
