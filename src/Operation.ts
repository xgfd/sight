import { v4 as uuidv4 } from 'uuid';
import { sha256hash } from './utils';

class Operation {
  readonly id: string;

  readonly script: string;

  readonly scriptHash: string;

  name: string;

  resultImage: string;

  args: (string | number)[] = [];

  constructor(name: string, script = '') {
    this.id = uuidv4();
    this.name = name;
    this.script = script;
    this.scriptHash = sha256hash(script);
    this.resultImage = '';
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

  public serialiseToPython() {
    let pyScript = '';
    pyScript = this.script;
    return pyScript;
  }

  public serialiseToJson() {
    return { script: this.script };
  }
}

export default Operation;
