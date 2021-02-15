import { InputNumber, Select } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class MinEnclosingCirclesControls extends DefaultControls {
  static defaultValues = [2, 1];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
          max={10}
          value={args[0]}
          onChange={(value) => this.updateArgs(0, value)}
        />
        <h4>Return image</h4>
        <Select
          value={args[1]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(1, value)}
        >
          <Option value={0}>Overlay (Colour)</Option>
          <Option value={1}>Contours only</Option>
          <Option value={2}>Original image</Option>
        </Select>
      </>
    );
  }
}
