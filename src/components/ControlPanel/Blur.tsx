import { InputNumber, Select } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class BlurControls extends DefaultControls {
  static defaultValues = [3, 3, 4];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>K-Size (h, w)</h4>
        <InputNumber
          min={3}
          step={2}
          value={args[0]}
          onChange={(value) => this.updateArgs(0, value)}
        />
        <InputNumber
          min={3}
          step={2}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <h4>Border Type</h4>
        <Select
          value={args[2]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(2, value)}
        >
          <Option value={4}>DEFAULT</Option>
          <Option value={0}>CONSTANT</Option>
          <Option value={1}>REPLICATE</Option>
          <Option value={2}>REFLECT</Option>
          <Option value={3}>WRAP</Option>
          <Option value={5}>TRANSPARENT</Option>
          <Option value={16}>ISOLATED</Option>
        </Select>
      </>
    );
  }
}
