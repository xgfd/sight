import { Select } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

export default class RotateControls extends ControlsBase {
  static defaultValues = [1];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Rotation</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value={0}>90</Option>
          <Option value={1}>180</Option>
          <Option value={2}>270</Option>
        </Select>
      </>
    );
  }
}
