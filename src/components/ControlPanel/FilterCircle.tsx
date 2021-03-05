import { Col, InputNumber, Row, Select } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

export default class FilterCircleControls extends ControlsBase {
  static defaultValues = [[25, 5_000_000] as [number, number], 2, 1];

  RangeComponent = (
    index: number,
    [lower, upper]: [number, number],
    step = 10
  ) => (
    <Row>
      <Col span={12}>
        <InputNumber
          size="small"
          style={{ width: 85 }}
          min={0}
          step={step}
          value={lower}
          onChange={(newLow) => {
            this.updateArgs(index, [newLow, Math.max(newLow as number, upper)]);
          }}
        />
      </Col>
      <Col span={12}>
        <InputNumber
          size="small"
          style={{ width: 85 }}
          min={0}
          step={10}
          value={upper}
          onChange={(newUp) => {
            this.updateArgs(index, [Math.min(lower, newUp as number), newUp]);
          }}
        />
      </Col>
    </Row>
  );

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Radius range</h4>
        {this.RangeComponent(0, args[0])}
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
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
