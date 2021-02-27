import { Select } from 'antd';
import React from 'react';
import DefaultControls from './Default';
import { OpControlsState, OpControlsProp } from './ControlsBase';

interface ExtraInputsState extends OpControlsState {
  inputRefs: string[];
}

const { Option } = Select;

export default class BitwiseAndControls extends DefaultControls<
  OpControlsProp,
  ExtraInputsState
> {
  static defaultInputRefs = [''];

  constructor(props: OpControlsProp) {
    super(props);
    const { selectedOp } = props;
    const { inputRefs } = selectedOp;
    this.state = {
      ...this.state,
      inputRefs,
    };
  }

  updateExtraInputs = (index: number, value: any) => {
    const { selectedOp, onChange } = this.props;
    selectedOp.updateInputRefs(index, value);
    this.setState({
      name: selectedOp.name,
      inputRefs: selectedOp.inputRefs,
    });
    const { live } = this.state;
    if (live) {
      onChange();
    }
  };

  render() {
    const { operations, index } = this.props;
    const { name, inputRefs: extraInputs } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Image 2</h4>
        <Select
          value={extraInputs[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateExtraInputs(0, value)}
        >
          {operations.slice(0, index).map((op, i) => (
            <Option key={op.id} value={op.id}>{`${i}-${op.name}`}</Option>
          ))}
        </Select>
      </>
    );
  }
}
