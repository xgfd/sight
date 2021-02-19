import { InputNumber, Select } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class MapContoursControls extends DefaultControls {
  static defaultValues = ['boundingRect', 2, 1];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Method</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value="boundingRect">boundingRect</Option>
          <Option value="minAreaRect">minAreaRect</Option>
          <Option value="fitEllipse">fitEllipse</Option>
          <Option value="convexHull">convexHull</Option>
          <Option value="minEnclosingCircle">minEnclosingCircle</Option>
          <Option value="minEnclosingTriangle">minEnclosingTriangle</Option>
        </Select>
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
          max={10}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <h4>Return image</h4>
        <Select
          value={args[2]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(2, value)}
        >
          <Option value={0}>Overlay (Colour)</Option>
          <Option value={1}>Contours only</Option>
          <Option value={2}>Original image</Option>
        </Select>
      </>
    );
  }
}
