export default interface Operation {
  id: string;
  name: string;
  args: any[];
  inputRefs: string[];
  updateArgs: (index: number, value: any) => void;
  updateInputRefs: (index: number, value: any) => void;
}
