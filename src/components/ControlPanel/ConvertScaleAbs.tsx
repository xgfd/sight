import { Slider } from 'antd';
import React from 'react';
import DefaultControls from './Default';

export default class ConvertScaleAbsControls extends DefaultControls {
  static defaultValues = [1, 0];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Alpha (contrast)</h4>
        <Slider
          max={10}
          step={0.1}
          value={args[0]}
          onChange={(value: number) => this.updateArgs(0, value)}
        />
        <h4>Beta (brightness)</h4>
        <Slider
          marks={{ 0: '0', 127: '127', 255: '255' }}
          max={255}
          value={args[1]}
          onChange={(value: number) => this.updateArgs(1, value)}
        />
      </>
    );
  }
}
