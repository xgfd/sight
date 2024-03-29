import { notification } from 'antd';
import { ipcRenderer } from 'electron';
import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';
import { PythonShell } from 'python-shell';
import { BUILTIN, CUSTOM, getPyPath, VISION } from './constants';
import OpItem from './Operation';
import { Instruction } from './type';

let CVSHELL: PythonShell;

function notify(
  type: 'success' | 'info' | 'warning' | 'error',
  message: string,
  description?: string,
  key?: string
) {
  notification[type]({
    key,
    message,
    description,
  });
}

function initPyEnvironment() {
  getPyPath((pythonPath) => {
    const options = {
      pythonPath,
      mode: 'text' as const,
      pythonOptions: ['-u'], // get print results in real-time
      scriptPath: VISION,
      env: {
        ...process.env,
        PYTHONIOENCODING: 'utf8',
      },
      cwd: VISION,
    };

    // notify if failed to start the Python engine
    const startErrorHandler = (e: Error) => {
      if (e.message.indexOf('ModuleNotFoundError') !== -1) {
        const missingModule = e.message.replace(
          'ModuleNotFoundError: No module named ',
          ''
        );
        notify(
          'error',
          `Missing module ${missingModule}`,
          `Sight is using Python ${pythonPath}. Is ${missingModule} installed in this Python?
        `
        );
      } else {
        notify('error', e.message, e.stack || '');
      }
    };

    CVSHELL = new PythonShell('engine.py', options);

    CVSHELL.once('message', () => CVSHELL.removeAllListeners('pythonError'));
    CVSHELL.on('pythonError', startErrorHandler);

    CVSHELL.send('echo ""');
  });
}

function reloadPython() {
  if (CVSHELL) {
    CVSHELL.kill();
  }
  initPyEnvironment();
}

function upsert(pack: string, module: string, cb: (err: boolean) => void) {
  const fullModuleName = `${pack}.${module}`;
  CVSHELL.send(`upsert ${JSON.stringify(fullModuleName)}`);

  const onMessage = (message: string) => {
    // the server upsert method returns stringified json boolean values
    // simply compare it with the string 'true' or 'false' to save parsing
    if (message === 'false') {
      // failed to upsert
      cb(true);
      notify('error', `Failed to load ${fullModuleName}.`);
    } else {
      // set cb error to false when upsert succeeded
      cb(false);
    }

    CVSHELL.removeListener('message', onMessage);
  };

  CVSHELL.on('message', onMessage);
}

function exportScript(
  operations: OpItem[],
  cb: (err: Error | null, filepath: string) => void
) {
  const instructions = operations.map((op) => op.toJson());
  CVSHELL.send(`export '${JSON.stringify(instructions)}'`);

  const onMessage = (message: string) => {
    try {
      const archivePath = JSON.parse(message);
      cb(null, archivePath);
    } catch (e) {
      cb(new Error('Failed to export'), '');
      console.error(message); /* eslint-disable-line no-console */
    }

    CVSHELL.removeListener('message', onMessage);
  };

  CVSHELL.on('message', onMessage);
}

/**
 * Execute a sequence of operations on the backend.
 * @param operations Operation sequence.
 * @param cb Callback function that is called for **each** operation after its execution.
 */
function run(
  operations: OpItem[],
  instructions: Instruction[],
  cb: (err: Error | null, op: OpItem | null, result: string) => void
) {
  CVSHELL.send(`run '${JSON.stringify(instructions)}'`);

  // make sure there's only one listener at all time
  CVSHELL.removeAllListeners('message');

  let notified = false;

  CVSHELL.on('message', (message) => {
    // ignore empty messages
    if (!message.trim()) {
      return;
    }

    try {
      const { rid, ret_hash: resultHash, error } = JSON.parse(message);

      // not a run response
      if (!rid) {
        return;
      }

      const retOp = operations.find((op) => op.id === rid);

      if (retOp) {
        // notify the first python execution error
        if (error && !notified) {
          notify('warning', `${retOp.name}: ${error}`);
          notified = true;
        }

        // in case of error the resultHash should be ""
        retOp.resultHash = resultHash;
        retOp.resultUpToDate = true;
        console.log(retOp); /* eslint-disable-line no-console */
        cb(null, retOp, resultHash);
      } else {
        // shouldn't reach this point
        notify(
          'warning',
          `Operation with id: ${rid} not found`,
          JSON.stringify(instructions)
        );
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        // non-json outputs are general messages
        notify('info', message);
      } else {
        // shouldn't reach this point
        notify('warning', (error as Error).message);
      }
    }
  });

  CVSHELL.removeAllListeners('pythonError');
  CVSHELL.on('pythonError', (err) => {
    if (err) {
      cb(err, null, '');
    }
  });
}

function rmScript(pack: string, module: string) {
  if (pack === 'custom') {
    try {
      fs.unlinkSync(path.join(CUSTOM, `${module}.py`));
    } catch {
      return true;
    }
    return true;
  }

  return false;
}

/**
 * List scripts saved under BUILTIN and CUSTOM.
 * Walk through the file system instead of calling `ls` on the server for performance reasons.
 */
function listScripts() {
  const builtin = fg
    .sync('*.py', { cwd: BUILTIN, ignore: ['__*.py'] })
    .map((fileName) => fileName.split('.')[0])
    .sort((a, b) => (a.toLowerCase() >= b.toLowerCase() ? 1 : -1));
  const custom = fg
    .sync('*.py', { cwd: CUSTOM, ignore: ['__*.py'] })
    .map((fileName) => fileName.split('.')[0])
    .sort((a, b) => (a.toLowerCase() >= b.toLowerCase() ? 1 : -1));
  return { builtin, custom };
}
ipcRenderer.on('RELOAD_PYTHON', () => {
  reloadPython();
});

initPyEnvironment();

export {
  reloadPython,
  listScripts,
  notify,
  run,
  upsert,
  rmScript,
  exportScript,
};
