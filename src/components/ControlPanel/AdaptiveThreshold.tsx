import { InputNumber, Select } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class AdaptiveThresholdControls extends DefaultControls {
  static defaultValues = [255, 0, 0, 21, 0];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Max value</h4>
        <InputNumber
          min={0}
          value={args[0]}
          onChange={(value) => this.updateArgs(0, value)}
        />
        <h4>Adaptive method</h4>
        <Select
          value={args[1]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(1, value)}
        >
          <Option value={0}>MEAN_C</Option>
          <Option value={1}>GAUSSIAN_C</Option>
        </Select>
        <h4>Threshold type</h4>
        <Select
          value={args[2]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(2, value)}
        >
          <Option value={0}>BINARY</Option>
          <Option value={1}>BINARY_INV</Option>
        </Select>
        <h4>Block size</h4>
        <InputNumber
          min={3}
          step={2}
          value={args[3]}
          onChange={(value) => this.updateArgs(3, value)}
        />
        <h4>Constant offset</h4>
        <InputNumber
          value={args[4]}
          onChange={(value) => this.updateArgs(4, value)}
        />
      </>
    );
  }
}
