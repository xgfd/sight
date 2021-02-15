import { InputNumber, Select, Switch } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class InscribedCircleControls extends DefaultControls {
  static defaultValues = [2, 3, 2, 1];

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
          <Option value={4}>L12</Option>
          <Option value={5}>FAIR</Option>
          <Option value={6}>WELSCH</Option>
          <Option value={7}>HUBER</Option>
        </Select>
        <h4>Distance type</h4>
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
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
          max={10}
          value={args[2]}
          onChange={(value) => this.updateArgs(2, value)}
        />
        <h4>Return image</h4>
        <Select
          value={args[3]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(3, value)}
        >
          <Option value={0}>Overlay (Colour)</Option>
          <Option value={1}>Contours only</Option>
          <Option value={2}>Original image</Option>
        </Select>
      </>
    );
  }
}
