import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import createControlComponent from './components/ControlPanel';
import { VISION } from './constants';

function sha256hash(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function loadScript(name: string, pack: 'builtin' | 'custom' | 'templates') {
  const pyPath = path.join(VISION, pack, `${name}.py`);
  let script;
  try {
    script = fs.readFileSync(pyPath, 'utf8');
  } catch (e) {
    // TODO defaults to "" or __template__.py?
    script = '';
  }
  return script;
}
class Operation {
  readonly id: string;

  readonly script: string;

  readonly scriptHash: string;

  saved = true;

  loading: boolean;

  name: string;

  package: 'custom' | 'builtin';

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
    this.name = name;
    this.package = pack;
    const component = createControlComponent(this);
    this.ControlPanel = component;
    this.args = [...component.defaultValues];

    if (newCustomOp) {
      this.script = loadScript('__template__', 'templates');
      this.saved = false;
    } else {
      this.script = loadScript(this.name, this.package);
    }

    this.scriptHash = sha256hash(this.script);
    this.resultImageHash = '';
  }

  public updateScript(script: string): boolean {
    // this.script is readonly
    // cast it to unknown to enable assignment internally
    (this.script as unknown) = script;
    const hash = sha256hash(script);
    if (hash !== this.script) {
      (this.scriptHash as unknown) = hash;
      return true;
    }
    return false;
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

  public serialiseToPython() {
    let pyScript = '';
    pyScript = this.script;
    return pyScript;
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
