import { Component } from 'react';

declare interface Operation {
  id: string;
  name: string;
  args: any[];
  extraImageRefs: string[];
  updateArgs: (index: number, value: any) => void;
  updateExtraRefs: (index: number, value: any) => void;
}

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
export default class ControlsBase<
  T extends OpControlsProp = OpControlsProp, // generic parameter defaults introduced in TS v2.3
  K extends OpControlsState = OpControlsState
> extends Component<T, K> {
  static defaultValues: (string | number | boolean | [number, number])[] = [];

  static defaultExtraRefs: string[] = [];

  updatedArgs = (index: number, value: any) => {};
}

export { OpControlsProp, OpControlsState, Operation };
