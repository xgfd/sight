import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import createControlComponent from './components/ControlPanel';
import { BUILTIN, TEMPLATES, CUSTOM } from './constants';

function sha256hash(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function loadScript(name: string, pack: 'builtin' | 'custom' | 'templates') {
  let pyPath;

  switch (pack) {
    case 'builtin':
      pyPath = path.join(BUILTIN, `${name}.py`);
      break;
    case 'custom':
      pyPath = path.join(CUSTOM, `${name}.py`);
      break;
    case 'templates':
      pyPath = path.join(TEMPLATES, `${name}.py`);
      break;
    default:
      return '';
  }

  let script;
  try {
    script = fs.readFileSync(pyPath, 'utf8');
  } catch (e) {
    script = '';
  }
  return script;
}

function writeScript(
  name: string,
  pack: 'builtin' | 'custom' | 'templates',
  script: string
) {
  let pyPath;

  switch (pack) {
    case 'builtin':
      pyPath = path.join(BUILTIN, `${name}.py`);
      break;
    case 'custom':
      pyPath = path.join(CUSTOM, `${name}.py`);
      break;
    case 'templates':
      pyPath = path.join(TEMPLATES, `${name}.py`);
      break;
    default:
      return;
  }

  // intentionally not wrapped with try-catch so App can catch it and display warnings
  fs.writeFileSync(pyPath, script);
}

class Operation {
  readonly id: string;

  readonly script: string;

  readonly scriptHash: string;

  // false if script is changed but not re-calculated
  resultUpToDate = true;

  loading: boolean;

  name: string;

  package: 'custom' | 'builtin';

  inputImageHash: string;

  resultImageHash: string;

  ControlPanel;

  args: ([number, number] | string | number | boolean)[] = [];

  constructor(
    name: string,
    pack: 'custom' | 'builtin' = 'custom',
    newCustomOp = false
  ) {
    this.id = uuidv4();
    this.loading = false;
    // remove invalid char for a python module's name
    this.name = name.replaceAll(/\.|-|\s|,/gi, '_');
    this.package = pack;
    const component = createControlComponent(this);
    this.ControlPanel = component;
    // important: create a shallow copy to avoid unwanted modification to component.defaultValues
    this.args = [...component.defaultValues];

    if (newCustomOp) {
      const script = loadScript('__template__', 'templates');
      this.script = script;
      this.scriptHash = sha256hash(script);
      writeScript(this.name, this.package, script);
    } else {
      this.script = loadScript(this.name, this.package);
      this.scriptHash = sha256hash(this.script);
    }

    this.inputImageHash = '';
    this.resultImageHash = '';
  }

  public updateScript(script: string) {
    if (this.script !== script) {
      // this.script is readonly
      // cast it to unknown to enable assignment internally
      this.resultUpToDate = false;
      (this.script as unknown) = script;
      const hash = sha256hash(script);
      (this.scriptHash as unknown) = hash;
      writeScript(this.name, this.package, script);
    }
  }

  public updateArgs(index: number, value: any) {
    this.args[index] = value;
    // create a new copy to trigger update
    this.args = [...this.args];
  }

  public getScript() {
    return this.script;
  }

  public getHash() {
    return this.scriptHash;
  }

  public toJson() {
    return {
      fn: `${this.package}.${this.name}`,
      rid: this.id,
      args: this.args,
    };
  }
}

export default Operation;
