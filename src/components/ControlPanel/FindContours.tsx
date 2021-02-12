import { InputNumber, Slider, Select, Switch } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class FindContoursControls extends DefaultControls {
  static defaultValues = [
    3,
    2,
    [25, 500] as [number, number],
    [25, 500] as [number, number],
    [3, 50] as [number, number],
    [0.01, 0.9] as [number, number],
    [50, 128] as [number, number],
    0,
    0,
    2,
    false,
  ];

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
        <h4>Area range</h4>
        <Slider
          range
          max={10000}
          value={args[2]}
          onChange={(value: [number, number]) => this.updateArgs(2, value)}
        />
        <h4>Bound area range</h4>
        <Slider
          range
          max={10000}
          value={args[3]}
          onChange={(value: [number, number]) => this.updateArgs(3, value)}
        />
        <h4>Length range</h4>
        <Slider
          range
          max={5000}
          value={args[4]}
          onChange={(value: [number, number]) => this.updateArgs(4, value)}
        />
        <h4>Aspect range</h4>
        <Slider
          range
          max={1}
          step={0.01}
          value={args[5]}
          onChange={(value: [number, number]) => this.updateArgs(5, value)}
        />
        <h4>Intensity range</h4>
        <Slider
          range
          max={255}
          value={args[6]}
          onChange={(value: [number, number]) => this.updateArgs(6, value)}
        />

        <h4>Offset X</h4>
        <InputNumber
          value={args[7]}
          onChange={(value) => this.updateArgs(7, value)}
        />
        <h4>Offset Y</h4>
        <InputNumber
          value={args[8]}
          onChange={(value) => this.updateArgs(8, value)}
        />
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
          max={10}
          value={args[9]}
          onChange={(value) => this.updateArgs(9, value)}
        />
        <h4>Draw on original</h4>
        <Switch
          checked={args[10]}
          onChange={(checked) => this.updateArgs(10, checked)}
        />
      </>
    );
  }
}
