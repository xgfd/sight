import { Select } from 'antd';
import React from 'react';
import ControlsBase, { OpControlsProp } from './ControlsBase';

const { Option } = Select;

export default class RefImageControls extends ControlsBase {
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
    const { name } = this.state;
    let { inputRefs } = this.state;
    const allIDs = operations.map((op) => op.id);
    inputRefs = inputRefs.map((id) => (allIDs.includes(id) ? id : ''));

    return (
      <>
        <h2>{name}</h2>
        <h4>Image</h4>
        <Select
          value={inputRefs[0]}
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
