import { InputNumber } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

export default class MedianControls extends ControlsBase {
  static defaultValues = [3];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>K-Size</h4>
        <InputNumber
          min={3}
          step={2}
          value={args[0]}
          onChange={(value) => this.updateArgs(0, value)}
        />
      </>
    );
  }
}
