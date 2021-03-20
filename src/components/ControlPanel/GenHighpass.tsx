import { InputNumber, Select } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

export default class GenHighpassControls extends ControlsBase {
  static defaultValues = ['Gaussian', 27, 'divide'];

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
          <Option value="Gaussian">Gaussian</Option>
          <Option value="box">box</Option>
          <Option value="median">median</Option>
          <Option value="max">max</Option>
          <Option value="min">min</Option>
        </Select>
        <h4>K-Size</h4>
        <InputNumber
          min={3}
          step={2}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <h4>Diff mode</h4>
        <Select
          value={args[2]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(2, value)}
        >
          <Option value="divide">divide</Option>
          <Option value="subtract">subtract</Option>
          <Option value="bitwise_and">bitwise and</Option>
        </Select>
      </>
    );
  }
}
