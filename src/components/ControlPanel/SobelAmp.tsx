import { Select } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

export default class SobelAmpControls extends ControlsBase {
  static defaultValues = ['sum_sqrt'];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Filter type</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value="sum_sqrt">sum_sqrt</Option>
          <Option value="sum_abs">sum_abs</Option>
          <Option value="x">x</Option>
          <Option value="y">y</Option>
        </Select>
      </>
    );
  }
}
