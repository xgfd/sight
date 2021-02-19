import { InputNumber, Select } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class ReduceContoursControls extends DefaultControls {
  static defaultValues = ['max', 'contourArea', 2, 1];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Method</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value="max">max</Option>
          <Option value="min">min</Option>
          <Option value="first">first</Option>
          <Option value="last">last</Option>
        </Select>
        <h4>Order by</h4>
        <Select
          value={args[1]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(1, value)}
        >
          <Option value="contourArea">contourArea</Option>
          <Option value="minAreaRect">minAreaRect</Option>
          <Option value="length">length</Option>
          <Option value="aspect">aspect</Option>
        </Select>
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
          max={10}
          value={args[2]}
          onChange={(value) => this.updateArgs(2, value)}
        />
        <h4>Return image</h4>
        <Select
          value={args[3]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(3, value)}
        >
          <Option value={0}>Overlay (Colour)</Option>
          <Option value={1}>Contours only</Option>
          <Option value={2}>Original image</Option>
        </Select>
      </>
    );
  }
}
