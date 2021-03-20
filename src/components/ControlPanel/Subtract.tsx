import { Select } from 'antd';
import React from 'react';
import BitwiseAndControls from './BitwiseAnd';

const { Option } = Select;

export default class SubtractControls extends BitwiseAndControls {
  static defaultInputRefs = [''];

  static defaultValues = [-1];

  render() {
    const { operations, index } = this.props;
    const { name, args } = this.state;
    let { inputRefs } = this.state;
    const allIDs = operations.map((op) => op.id);
    inputRefs = inputRefs.map((id) => (allIDs.includes(id) ? id : ''));

    return (
      <>
        <h2>{name}</h2>
        <h4>Image 2</h4>
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
        <h4>Output type (dtype)</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value={-1}>Unchanged</Option>
          <Option value={0}>CV_8U</Option>
          <Option value={1}>CV_8S</Option>
          <Option value={2}>CV_16U</Option>
          <Option value={3}>CV_16S</Option>
          <Option value={4}>CV_32S</Option>
          <Option value={5}>CV_32F</Option>
          <Option value={6}>CV_64F</Option>
        </Select>
      </>
    );
  }
}
