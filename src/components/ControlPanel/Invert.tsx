import { Slider } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

export default class InRangeControls extends ControlsBase {
  static defaultValues = [[50, 150] as [number, number]];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Thresholds</h4>
        <Slider
          marks={{ 0: '0', 255: '255' }}
          range
          min={0}
          max={255}
          value={args[0]}
          onChange={(value: [number, number]) => this.updateArgs(0, value)}
        />
      </>
    );
  }
}
