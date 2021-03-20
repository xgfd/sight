import { Slider } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

export default class HighpassControls extends ControlsBase {
  static defaultValues = [3];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>K-Size</h4>
        <Slider
          marks={{
            3: '3',
            21: '21',
            41: '41',
            61: '61',
            81: '81',
            101: '101',
          }}
          min={3}
          max={101}
          step={2}
          value={args[0]}
          onChange={(value: number) => this.updateArgs(0, value)}
        />
      </>
    );
  }
}
