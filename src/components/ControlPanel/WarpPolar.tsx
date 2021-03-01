import { InputNumber, Select } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

export default class WarpPolarControls extends ControlsBase {
  static defaultValues = [0, 0, 1, 0];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>DSize (h, w)</h4>
        <InputNumber
          min={0}
          step={100}
          value={args[0]}
          onChange={(value) => this.updateArgs(0, value)}
        />
        <InputNumber
          min={0}
          step={100}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <h4>Interpolation flag</h4>
        <Select
          value={args[2]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(2, value)}
        >
          <Option value={0}>NEAREST</Option>
          <Option value={1}>LINEAR</Option>
          <Option value={2}>CUBIC</Option>
          <Option value={3}>AREA</Option>
          <Option value={4}>LANCZOS4</Option>
          <Option value={5}>LINEAR_EXACT</Option>
          <Option value={6}>NEAREST_EXACT</Option>
          <Option value={7}>MAX</Option>
        </Select>
        <h4>Warp polar mode </h4>
        <Select
          value={args[3]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(3, value)}
        >
          <Option value={0}>POLAR_LINEAR</Option>
          <Option value={256}>POLAR_LOG</Option>
        </Select>
      </>
    );
  }
}
