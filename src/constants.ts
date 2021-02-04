import path from 'path';

const VISION = path.join(__dirname, 'assets', 'vision');
const IMAGE_CACHE = path.join(VISION, '.cache');
const BUILTIN = path.join(VISION, 'builtin');
const CUSTOM = path.join(VISION, 'custom');
const ENGINE_PY = path.join(VISION, 'engine.py');

export { VISION, BUILTIN, CUSTOM, IMAGE_CACHE };
