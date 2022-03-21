import { Col, InputNumber, Row, Select, Slider } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

export default class NonMaxSupressionControls extends ControlsBase {
  static defaultValues = [0.2, 2, 1];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Overlap threshold</h4>
        <Slider
          marks={{
            0: '0',
            0.25: '.25',
            0.5: '.50',
            0.75: '.75',
            1: '1',
          }}
          tipFormatter={(v) => `${(v as number) * 100}%`}
          min={0.01}
          max={1}
          step={0.01}
          value={args[0]}
          onChange={(value: number) => this.updateArgs(0, value)}
        />
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <h4>Return image</h4>
        <Select
          value={args[2]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(2, value)}
        >
          <Option value={0}>Overlay (Colour)</Option>
          <Option value={1}>Contours only</Option>
          <Option value={2}>Original image</Option>
        </Select>
      </>
    );
  }
}
