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
  inputRefs: string[];
}
export default abstract class ControlsBase extends Component<
  OpControlsProp,
  OpControlsState
> {
  static defaultValues: (string | number | boolean | [number, number])[] = [];

  static defaultInputRefs: string[] = [];

  constructor(props: OpControlsProp) {
    super(props);
    const { selectedOp } = props;
    const { name, args } = selectedOp;
    // eslint-disable-next-line react/no-unused-state
    this.state = { name, args: [...args], live: true, inputRefs: [] };
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

  updateExtraInputs = (index: number, value: any) => {};
}

export { OpControlsProp, OpControlsState };
