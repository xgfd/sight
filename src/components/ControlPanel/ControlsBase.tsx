import { Component } from 'react';
import { Operation } from '../../type';

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

  static defaultInputRefs: string[] = [];

  constructor(props: T) {
    super(props);
    const { selectedOp } = props;
    const { name, args } = selectedOp;
    // eslint-disable-next-line react/no-unused-state
    this.state = { name, args: [...args], live: true } as K;
  }

  updateArgs = (index: number, value: any) => {
    const { selectedOp, onChange } = this.props;
    selectedOp.updateArgs(index, value);
    // eslint-disable-next-line react/no-unused-state
    this.setState({ name: selectedOp.name, args: selectedOp.args });
    const { live } = this.state;
    if (live) {
      onChange();
    }
  };

  updateExtraInputs = (index: number, value: any) => undefined;
}

export { OpControlsProp, OpControlsState };
