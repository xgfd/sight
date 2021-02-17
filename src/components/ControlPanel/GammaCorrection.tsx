import { Slider } from 'antd';
import React from 'react';
import DefaultControls from './Default';

export default class GammaCorrectionControls extends DefaultControls {
  static defaultValues = [1];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Gamma</h4>
        <Slider
          min={0.01}
          max={10}
          step={0.01}
          value={args[0]}
          onChange={(value: number) => this.updateArgs(0, value)}
        />
      </>
    );
  }
}
