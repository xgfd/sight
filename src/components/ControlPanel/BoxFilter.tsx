import { InputNumber, Select, Switch } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class BoxFilterControls extends DefaultControls {
  static defaultValues = [3, 3, true, 4];

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
        <h4>Normalize</h4>
        <Switch
          checked={args[2]}
          onChange={(checked) => this.updateArgs(2, checked)}
        />
        <h4>Border type</h4>
        <Select
          value={args[3]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(3, value)}
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
