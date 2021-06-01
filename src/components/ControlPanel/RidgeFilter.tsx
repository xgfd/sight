import { Switch, InputNumber, Select } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

export default class RidgeFilterControls extends ControlsBase {
  static defaultValues = [
    [1, 10, 2] as [number, number, number],
    true,
    'meijering',
  ];

  render() {
    const { name, args } = this.state;

    const [sigmaMin, sigmaMax, sigmaStep] = args[0];

    return (
      <>
        <h2>{name}</h2>
        <h4>Sigmas (min, max, step)</h4>
        <InputNumber
          style={{ width: '67px' }}
          min={1}
          max={sigmaMax - 1}
          value={sigmaMin}
          onChange={(value) => this.updateArgs(0, [value, sigmaMax, sigmaStep])}
        />
        <InputNumber
          style={{ width: '67px' }}
          min={sigmaMin + 1}
          max={100}
          value={sigmaMax}
          onChange={(value) => this.updateArgs(0, [sigmaMin, value, sigmaStep])}
        />
        <InputNumber
          style={{ width: '66px' }}
          min={1}
          max={10}
          value={sigmaStep}
          onChange={(value) => this.updateArgs(0, [sigmaMin, sigmaMax, value])}
        />
        <h4>Black ridges</h4>
        <Switch
          checked={args[1]}
          onChange={(checked) => this.updateArgs(1, checked)}
        />
        <h4>Ridge filter</h4>
        <Select
          value={args[2]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(2, value)}
        >
          <Option value="meijering">Meijering</Option>
          <Option value="sato">Sato</Option>
          <Option value="frangi">Frangi</Option>
          <Option value="hessian">Hessian</Option>
        </Select>
      </>
    );
  }
}
