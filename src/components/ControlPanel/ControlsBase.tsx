import { Component } from 'react';
import Operation from '../../type';

interface OpControlsProp {
  selectedOp: Operation;
  operations: Operation[];
  index: number;
  onChange: (index?: number) => void;
}

interface OpControlsState {
  name: string;
  args: any[];
  live: boolean;
}
export default abstract class ControlsBase<
  T extends OpControlsProp = OpControlsProp, // generic parameter defaults introduced in TS v2.3
  K extends OpControlsState = OpControlsState
> extends Component<T, K> {
  static defaultValues: (string | number | boolean | [number, number])[] = [];

  static defaultExtraRefs: string[] = [];

  abstract updateArgs: (index: number, value: any) => void;

  abstract updateExtraInputs?: (index: number, value: any) => void;
}

export { OpControlsProp, OpControlsState };
