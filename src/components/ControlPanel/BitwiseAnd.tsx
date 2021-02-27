import { Select } from 'antd';
import React from 'react';
import DefaultControls from './Default';
import { OpControlsState, OpControlsProp } from './ControlsBase';

interface ExtraInputsState extends OpControlsState {
  extraRefs: string[];
}

const { Option } = Select;

export default class BitwiseAndControls extends DefaultControls<
  OpControlsProp,
  ExtraInputsState
> {
  static defaultValues = [];

  static defaultExtraRefs = [''];

  constructor(props: OpControlsProp) {
    super(props);
    const { selectedOp } = props;
    const { extraImageRefs: extraRefs } = selectedOp;
    this.state = {
      ...this.state,
      extraRefs,
    };
  }

  updateExtraInputs(index: number, value: any) {
    const { selectedOp, onChange } = this.props;
    selectedOp.updateExtraRefs(index, value);
    this.setState({
      name: selectedOp.name,
      extraRefs: selectedOp.extraImageRefs,
    });
    const { live } = this.state;
    if (live) {
      onChange();
    }
  }

  render() {
    const { operations, index } = this.props;
    const { name, extraRefs: extraInputs } = this.state;

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
