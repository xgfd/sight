import { Slider } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

export default class LocalMaximaControls extends ControlsBase {
  static defaultValues = [1];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Peak distance</h4>
        <Slider
          min={1}
          max={100}
          step={1}
          marks={{ 1: '1', 25: '25', 50: '50', 75: '75', 100: '100' }}
          value={args[0]}
          onChange={(value) => this.updateArgs(0, value)}
        />
      </>
    );
  }
}
