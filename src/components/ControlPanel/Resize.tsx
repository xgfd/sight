import { Select, Slider, Switch } from 'antd';
import React from 'react';
import ControlsBase, { OpControlsProp, OpControlsState } from './ControlsBase';

const { Option } = Select;

interface ResizeControlsState extends OpControlsState {
  lockAspect: boolean;
}

function twoDecimal(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export default class ResizeControls extends ControlsBase<
  OpControlsProp,
  ResizeControlsState
> {
  static defaultValues = [1, 1, 1];

  constructor(props: OpControlsProp) {
    super(props);
    this.state = {
      ...this.state,
      lockAspect: true,
    };
  }

  render() {
    const { name, args, lockAspect } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Lock aspect</h4>
        <Switch
          checked={lockAspect}
          onChange={(checked) => {
            this.setState({ lockAspect: checked });
          }}
        />
        <h4>Horizontal scale (fx)</h4>
        <Slider
          marks={{
            '-2': '0.01',
            '-1': '0.1',
            0: '1',
            1: '10',
            2: '100',
          }}
          tipFormatter={(value) => twoDecimal(10 ** (value as number))}
          min={-2}
          max={2}
          step={0.01}
          value={Math.log10(args[0])}
          onChange={(value: number) => {
            this.updateArgs(0, 10 ** value);
            if (lockAspect) {
              this.updateArgs(1, 10 ** value);
            }
          }}
        />
        <h4>Vertical scale (fy)</h4>
        <Slider
          marks={{
            '-2': '0.01',
            '-1': '0.1',
            0: '1',
            1: '10',
            2: '100',
          }}
          tipFormatter={(value) => twoDecimal(10 ** (value as number))}
          min={-2}
          max={2}
          step={0.01}
          value={Math.log10(args[1])}
          onChange={(value: number) => {
            this.updateArgs(1, 10 ** value);
            if (lockAspect) {
              this.updateArgs(0, 10 ** value);
            }
          }}
        />
        <h4>Interpolation</h4>
        <Select
          value={args[2]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(2, value)}
        >
          <Option value={0}>INTER_NEAREST</Option>
          <Option value={1}>INTER_LINEAR</Option>
          <Option value={2}>INTER_CUBIC</Option>
          <Option value={3}>INTER_AREA</Option>
          <Option value={4}>INTER_LANCZOS4</Option>
          <Option value={5}>INTER_LINEAR_EXACT</Option>
          <Option value={6}>INTER_NEAREST_EXACT</Option>
        </Select>
      </>
    );
  }
}
