import { PythonShell } from 'python-shell';
import { notification } from 'antd';
import fg from 'fast-glob';
import { BUILTIN, CUSTOM, VISION } from './constants';
import Operation from './Operation';

/**
 * Execute a sequence of operations on the backend.
 * @param operations Operation sequence.
 * @param beforeRun Callback function that is called once before the execution of all operations.
 * @param cb Callback function that is called for **each** operation after its execution.
 */
function run(
  operations: Operation[],
  lastHash: string,
  beforeRun: () => void,
  cb: (op: Operation, result: string) => void
) {
  const instructions = operations.map((op, index) => {
    const opJson = op.toJson();
    if (index === 0) {
      return { ...opJson, last_hash: lastHash };
    }
    return opJson;
  });

  const cmds = JSON.stringify(instructions);
  // const cmds =
  //   '[{"fn":"builtin.imread","rid":"0","args":["test.png"]},{"fn":"builtin.canny","rid":"1","args":[[80,120],3]},{"fn":"builtin.imread","rid":"2","args":["test.png"]}]';
  console.log('cmds', cmds);
  const options = {
    mode: 'text' as 'json' | 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: VISION,
    args: ['run', cmds],
    cwd: VISION,
  };
  const pyshell = new PythonShell('engine.py', options);

  beforeRun();

  pyshell.send('');

  pyshell.on('message', (message) => {
    console.log(message);
    try {
      const { rid, ret_hash: resultHash } = JSON.parse(message);
      const retOp = operations.find((op) => op.id === rid);
      if (retOp) {
        retOp.resultImageHash = resultHash;
        cb(retOp, resultHash);
      } else if (rid) {
        console.error(`$Operation ${rid} not found`);
      }
    } catch (error) {
      console.log(error);
    }
  });

  // end the input stream and allow the process to exit
  pyshell.end((err) => {
    if (err) {
      console.log(err.stack);
    }
    console.log('finished');
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
export { listScripts, notify, run, upsert };
