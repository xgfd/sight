import { PythonShell } from 'python-shell';
import { notification } from 'antd';
import fg from 'fast-glob';
import { BUILTIN, CUSTOM, VISION } from './constants';
import Operation from './Operation';

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

/**
 * Execute a sequence of operations on the backend.
 * @param operations Operation sequence.
 * @param cb Callback function that is called for **each** operation after its execution.
 */
function run(
  operations: Operation[],
  lastHash: string,
  cb: (op: Operation, result: string) => void
) {
  const instructions = operations.map((op, index) => {
    const opJson = op.toJson();
    // add the input hash for the first operation
    if (index === 0) {
      return { ...opJson, last_hash: lastHash };
    }
    return opJson;
  });

  const options = {
    mode: 'text' as 'json' | 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: VISION,
    args: ['run', JSON.stringify(instructions)],
    cwd: VISION,
  };
  const shell = new PythonShell('engine.py', options);

  // send anything to trigger the call
  shell.send('');

  shell.on('message', (message) => {
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
        cb(retOp, resultHash);
      } else if (rid) {
        notify('warning', `Operation ${rid} not found`);
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        notify('info', message);
      } else {
        console.error(error);
      }
    }
  });

  // end the input stream and allow the process to exit
  shell.end((err) => {
    if (err) {
      console.error(err.stack);
    }
  });
}

/**
 * Add a new function or update an existing custom function.
 * @param op New script to be added to custom functions.
 */
function upsert(op: Operation) {}

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

export { listScripts, notify, run, upsert };
