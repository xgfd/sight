import { Select, Switch } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

export default class DistanceTransformControls extends ControlsBase {
  static defaultValues = [2, 3, true];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Distance type</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value={1}>L1</Option>
          <Option value={2}>L2</Option>
          <Option value={3}>C</Option>
        </Select>
        <h4>Mask size</h4>
        <Select
          value={args[1]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(1, value)}
        >
          <Option value={3}>MASK_3</Option>
          <Option value={5}>MASK_5</Option>
          <Option value={0}>MASK_PRECISE</Option>
        </Select>
        <h4>Normalise</h4>
        <Switch
          checked={args[2]}
          onChange={(checked) => this.updateArgs(2, checked)}
        />
      </>
    );
  }
}
