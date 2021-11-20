interface Operation {
  id: string;
  name: string;
  args: any[];
  inputRefs: string[];
  updateArgs: (index: number, value: any) => void;
  updateInputRefs: (index: number, value: any) => void;
}

interface OpJSON {
  fn: string;
  args: (string | number | boolean | number[])[];
  rid?: string;
  extra_inputs: string[];
}

interface Instruction {
  fn: string;
  args: (string | number | boolean | number[])[];
  rid: string;
  last_hash?: string;
  extra_inputs: (string | number)[];
}

export { OpJSON, Instruction, Operation };
