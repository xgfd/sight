import { InputNumber, Select, Slider } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

export default class CircleROIControls extends ControlsBase {
  static defaultValues = [3, 2, [0.4, 0.7] as [number, number], 0.6, 2, 1];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Contour mode</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value={0}>EXTERNAL</Option>
          <Option value={1}>LIST</Option>
          <Option value={2}>CCOMP</Option>
          <Option value={3}>TREE</Option>
          <Option value={4}>FLOODFILL</Option>
        </Select>
        <h4>Approximation method</h4>
        <Select
          value={args[1]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(1, value)}
        >
          <Option value={1}>NONE</Option>
          <Option value={2}>SIMPLE</Option>
          <Option value={3}>TC89_L1</Option>
          <Option value={4}>TC89_KCOS</Option>
        </Select>
        <h4>ROI percentage range</h4>
        <Slider
          range
          tipFormatter={(v) => `${(v as number) * 100}%`}
          max={1}
          step={0.01}
          value={args[2]}
          onChange={(value: [number, number]) => this.updateArgs(2, value)}
        />
        <h4>Aspect range</h4>
        <Slider
          marks={{ 0: '0', 1: '1' }}
          max={1}
          step={0.01}
          value={args[3]}
          onChange={(value: number) => this.updateArgs(3, value)}
        />
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
          max={10}
          value={args[4]}
          onChange={(value) => this.updateArgs(4, value)}
        />
        <h4>Return image</h4>
        <Select
          value={args[5]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(5, value)}
        >
          <Option value={0}>Overlay (Colour)</Option>
          <Option value={1}>Contours only</Option>
          <Option value={2}>Original image</Option>
        </Select>
      </>
    );
  }
}
