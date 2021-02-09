import { InputNumber, Slider, Switch } from 'antd';
import React from 'react';
import DefaultControls from './Default';

export default class CannyControls extends DefaultControls {
  static defaultValues = [[50, 150] as [number, number], 3, false];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Thresholds</h4>
        <Slider
          range
          max={360}
          value={args[0]}
          onChange={(value: [number, number]) => this.updateArgs(0, value)}
        />
        <h4>Aperture size (odd only)</h4>
        <InputNumber
          min={3}
          max={7}
          step={2}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <h4>High accuracy (L2gradient)</h4>
        <Switch
          checked={args[2]}
          onChange={(checked) => this.updateArgs(2, checked)}
        />
      </>
    );
  }
}
