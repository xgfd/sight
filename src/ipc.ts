// package for IPC functionalities
import Operation from './Operation';

function ls(): { builtin: string[]; custom: string[] } {
  return { builtin: ['imread', 'canny'], custom: ['imreadtest'] };
}

function run(operations: Operation[]) {}

function upsert(op: Operation) {}

export { ls, run, upsert };
