import { InputNumber, Select } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class NormalizeControls extends DefaultControls {
  static defaultValues = [0, 255, 32, -1];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Alpha</h4>
        <InputNumber
          min={0}
          max={255}
          value={args[0]}
          onChange={(value) => this.updateArgs(0, value)}
        />
        <h4>Beta</h4>
        <InputNumber
          min={0}
          max={255}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <h4>Norm type</h4>
        <Select
          value={args[2]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(2, value)}
        >
          <Option value={1}>NORM_INF</Option>
          <Option value={2}>NORM_L1</Option>
          <Option value={4}>NORM_L2</Option>
          <Option value={32}>NORM_MINMAX</Option>
        </Select>
        <h4>Output type (dtype)</h4>
        <Select
          value={args[3]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(3, value)}
        >
          <Option value={-1}>Unchanged</Option>
          <Option value={0}>CV_8U</Option>
          <Option value={1}>CV_8S</Option>
          <Option value={2}>CV_16U</Option>
          <Option value={3}>CV_16S</Option>
          <Option value={4}>CV_32S</Option>
          <Option value={5}>CV_32F</Option>
          <Option value={6}>CV_64F</Option>
        </Select>
      </>
    );
  }
}
