import { Slider } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

export default class GammaCorrectionControls extends ControlsBase {
  static defaultValues = [1];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Gamma</h4>
        <Slider
          marks={{ 0.01: '.01', 10: '10' }}
          min={0.01}
          max={50}
          step={0.01}
          value={args[0]}
          onChange={(value: number) => this.updateArgs(0, value)}
        />
      </>
    );
  }
}
