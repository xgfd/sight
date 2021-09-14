import { Slider, InputNumber, Switch } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

export default class CornerHarrisControls extends ControlsBase {
  static defaultValues = [2, 3, 0.04, true];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Block Size</h4>
        <Slider
          marks={{
            2: '2',
            10: '10',
            25: '25',
            50: '50',
            75: '75',
            100: '100',
          }}
          min={2}
          max={100}
          value={args[0]}
          onChange={(value: number) => this.updateArgs(0, value)}
        />
        {/* <InputNumber
          min={1}
          value={args[0]}
          onChange={(value) => this.updateArgs(0, value)}
        /> */}
        <h4>Aperture Size</h4>
        <Slider
          marks={{
            3: '3',
            7: '7',
            11: '11',
            15: '15',
            19: '19',
            23: '23',
            27: '27',
            31: '31',
          }}
          min={3}
          max={31}
          step={2}
          value={args[1]}
          onChange={(value: number) => this.updateArgs(1, value)}
        />
        <h4>k</h4>
        <InputNumber
          step={0.01}
          value={args[2]}
          onChange={(value) => this.updateArgs(2, value)}
        />
        <h4>Normalise</h4>
        <Switch
          checked={args[3]}
          onChange={(checked) => this.updateArgs(3, checked)}
        />
      </>
    );
  }
}
