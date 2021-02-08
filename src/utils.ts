import { notification } from 'antd';
import fg from 'fast-glob';
import { PythonShell } from 'python-shell';
import { BUILTIN, CUSTOM, VISION } from './constants';
import Operation from './Operation';

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
  // notify if failed to start the Python engine
  const startErrorHandler = (e: Error) => {
    if (e.message.indexOf('ModuleNotFoundError') !== -1) {
      const missingModule = e.message.replace(
        'ModuleNotFoundError: No module named ',
        ''
      );
      PythonShell.runString(
        'import sys; print(sys.executable)',
        undefined,
        (_, res) => {
          notify(
            'error',
            `Missing module ${missingModule}`,
            `Using ${
              (res as string[])[0]
            }. \nMake sure ${missingModule} is installed in this Python environment.`
          );
        }
      );
    } else {
      notify('error', e.message, e.stack);
    }
  };

  const options = {
    mode: 'text' as const,
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: VISION,
    cwd: VISION,
  };
  CVSHELL = new PythonShell('engine.py', options);

  CVSHELL.send('echo "connect"');

  CVSHELL.once('message', () => CVSHELL.removeAllListeners('error'));
  CVSHELL.on('error', startErrorHandler);
}

/**
 * Execute a sequence of operations on the backend.
 * @param operations Operation sequence.
 * @param cb Callback function that is called for **each** operation after its execution.
 */
function run(
  operations: Operation[],
  lastHash: string,
  cb: (err: Error | null, op: Operation | null, result: string) => void
) {
  const instructions = operations.map((op, index) => {
    const opJson = op.toJson();
    // add the input hash for the first operation
    if (index === 0) {
      return { ...opJson, last_hash: lastHash };
    }
    return opJson;
  });

  // const options = {
  //   mode: 'text' as 'json' | 'text',
  //   pythonOptions: ['-u'], // get print results in real-time
  //   scriptPath: VISION,
  //   args: ['run', JSON.stringify(instructions)],
  //   cwd: VISION,
  // };
  // const shell = new PythonShell('engine.py', options);

  // send anything to trigger the call
  CVSHELL.send(`run '${JSON.stringify(instructions)}'`);
  // notify('info', JSON.stringify(instructions));

  CVSHELL.removeAllListeners('message');
  CVSHELL.removeAllListeners('error');

  CVSHELL.on('message', (message) => {
    // ignore empty messages
    if (!message.trim()) {
      return;
    }

    try {
      const { rid, ret_hash: resultHash, error } = JSON.parse(message);

      const retOp = operations.find((op) => op.id === rid);

      if (retOp) {
        // notify python execution errors
        if (error) {
          notify('warning', `${retOp.name}: ${error}`);
        }
        // in case of error the resultHash should be ""
        retOp.resultImageHash = resultHash;
        retOp.resultUpToDate = true;
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
        notify('warning', error);
      }
    }
  });

  CVSHELL.on('error', (err) => {
    if (err) {
      cb(err, null, '');
    }
  });

  // // throw error to App
  // shell.end((err) => {
  //   if (err) {
  //     cb(err, null, '');
  //   }
  // });
}

/**
 * List scripts saved under BUILTIN and CUSTOM.
 * Walk through the file system instead of calling `ls` on the server for performance reasons.
 */
function listScripts() {
  const builtin = fg
    .sync('*.py', { cwd: BUILTIN, ignore: ['__*.py'] })
    .map((fileName) => fileName.split('.')[0]);
  const custom = fg
    .sync('*.py', { cwd: CUSTOM, ignore: ['__*.py'] })
    .map((fileName) => fileName.split('.')[0]);
  return { builtin, custom };
}

initPyEnvironment();

export { listScripts, notify, run };
