import { InputNumber, Select } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class BilateralControls extends DefaultControls {
  static defaultValues = [5, 50, 50, 4];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Diameter</h4>
        <InputNumber
          min={3}
          value={args[0]}
          onChange={(value) => this.updateArgs(0, value)}
        />
        <h4>Sigma colour</h4>
        <InputNumber
          min={0}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <h4>Sigma space</h4>
        <InputNumber
          min={0}
          value={args[2]}
          onChange={(value) => this.updateArgs(2, value)}
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
