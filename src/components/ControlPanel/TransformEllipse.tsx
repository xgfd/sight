import { InputNumber, Slider, Select } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

export default class TransformEllipseControls extends ControlsBase {
  static defaultValues = [1, 0, 2, 1];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Scale</h4>
        <Slider
          marks={{ 0: '0', 1: '1', 2: '2' }}
          max={2}
          step={0.01}
          value={args[0]}
          onChange={(value: number) => this.updateArgs(0, value)}
        />
        <h4>Rotation</h4>
        <Slider
          tipFormatter={(v) => `${v}°`}
          marks={{ '-180': '-180°', 0: '0°', 180: '180°' }}
          min={-180}
          max={180}
          step={1}
          value={args[1]}
          onChange={(value: number) => this.updateArgs(1, value)}
        />
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
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
