import { InputNumber } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

export default class NpSumControls extends ControlsBase {
  static defaultValues = [0];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Axis</h4>
        <InputNumber
          min={0}
          step={1}
          value={args[0]}
          onChange={(value) => this.updateArgs(0, value)}
        />
      </>
    );
  }
}
