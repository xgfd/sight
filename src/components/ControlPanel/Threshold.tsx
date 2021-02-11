import { InputNumber, Select } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class ThresholdControls extends DefaultControls {
  static defaultValues = [127, 255, 0];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Threshold</h4>
        <InputNumber
          min={0}
          value={args[0]}
          onChange={(value) => this.updateArgs(0, value)}
        />
        <h4>Max value</h4>
        <InputNumber
          min={0}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
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
          <Option value={2}>TRUNC</Option>
          <Option value={3}>TOZERO</Option>
          <Option value={4}>TOZERO_INV</Option>
          <Option value={7}>THRESH_MASK</Option>
          <Option value={8}>THRESH_OTSU</Option>
          <Option value={16}>TRIANGLE</Option>
        </Select>
      </>
    );
  }
}