import path from 'path';
import fs from 'fs';
import os from 'os';

const VISION =
  process.env.NODE_ENV !== 'development'
    ? path.join(process.resourcesPath, 'vision')
    : path.join(process.resourcesPath, '../../../../../../vision');

const BUILTIN = path.join(VISION, 'builtin');
const CUSTOM = path.join(VISION, 'custom');
const TEMPLATES = path.join(VISION, 'templates');

// the following folders must point to the same locations in vision/engine.py
const APP_DATA = path.join(os.homedir(), '.sight');
const IMAGE_CACHE = path.join(APP_DATA, 'cache');

fs.mkdir(IMAGE_CACHE, { recursive: true }, (err) => {
  if (err) console.error(err);
});

export { VISION, BUILTIN, TEMPLATES, CUSTOM, IMAGE_CACHE };
