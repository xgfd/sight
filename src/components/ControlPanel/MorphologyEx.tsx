import { InputNumber, Select } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class MorphologyExControls extends DefaultControls {
  static defaultValues = [0, 3, 3, 0];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Element shape</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value={0}>RECT</Option>
          <Option value={1}>CROSS</Option>
          <Option value={2}>ELLIPSE</Option>
        </Select>
        <h4>K-Size (h, w)</h4>
        <InputNumber
          min={3}
          step={2}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <InputNumber
          min={3}
          step={2}
          value={args[2]}
          onChange={(value) => this.updateArgs(2, value)}
        />
        <h4>Morph type</h4>
        <Select
          value={args[3]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(3, value)}
        >
          <Option value={0}>ERODE</Option>
          <Option value={1}>DILATE</Option>
          <Option value={2}>OPEN</Option>
          <Option value={3}>CLOSE</Option>
          <Option value={4}>GRADIENT</Option>
          <Option value={5}>TOPHAT</Option>
          <Option value={6}>BLACKHAT</Option>
          <Option value={7}>HITMISS</Option>
        </Select>
      </>
    );
  }
}
