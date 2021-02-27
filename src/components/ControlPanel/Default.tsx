import { Input, InputNumber, Slider, Switch } from 'antd';
import React from 'react';
import ControlsBase, { OpControlsProp, OpControlsState } from './ControlsBase';

export default class DefaultControls<
  T extends OpControlsProp = OpControlsProp,
  K extends OpControlsState = OpControlsState
> extends ControlsBase<T, K> {
  static defaultValues = [[50, 150] as [number, number], 3, 3, 0, 0, '', false];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Thresholds</h4>
        <Slider
          marks={{ 0: '0', 180: '180', 360: '360' }}
          range
          max={360}
          value={args[0]}
          onChange={(value: [number, number]) => this.updateArgs(0, value)}
        />
        <h4>Kernel row</h4>
        <InputNumber
          min={3}
          max={255}
          step={2}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <h4>Kernel column</h4>
        <InputNumber
          min={3}
          max={255}
          step={2}
          value={args[2]}
          onChange={(value) => this.updateArgs(2, value)}
        />
        <h4>Int arg 1</h4>
        <InputNumber
          min={-1}
          max={255}
          step={1}
          value={args[3]}
          onChange={(value) => this.updateArgs(3, value)}
        />
        <h4>Int arg 2</h4>
        <InputNumber
          min={-1}
          max={255}
          step={1}
          value={args[4]}
          onChange={(value) => this.updateArgs(4, value)}
        />
        <h4>Str arg</h4>
        <Input
          value={args[5]}
          onChange={(value) => this.updateArgs(5, value)}
        />
        <h4>Boolean arg</h4>
        <Switch
          checked={args[6]}
          onChange={(checked) => this.updateArgs(6, checked)}
        />
      </>
    );
  }
}
