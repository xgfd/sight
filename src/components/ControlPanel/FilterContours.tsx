import { Col, InputNumber, Row, Select, Slider } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class FilterContoursControls extends DefaultControls {
  static defaultValues = [
    [25, 5_000_000] as [number, number],
    [25, 5_000_000] as [number, number],
    [5, 3_000] as [number, number],
    [10, 10_000] as [number, number],
    [0.01, 1] as [number, number],
    [0, 128] as [number, number],
    2,
    1,
  ];

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
        <h4>Area range</h4>
        {this.RangeComponent(0, args[0])}
        <h4>Bound area range</h4>
        {this.RangeComponent(1, args[1])}
        <h4>Bound length range</h4>
        {this.RangeComponent(2, args[2], 5)}
        <h4>Arc length range</h4>
        {this.RangeComponent(3, args[3], 5)}
        <h4>Aspect range</h4>
        <Slider
          marks={{ 0: '0', 0.5: '.5', 1: '1' }}
          range
          max={1}
          step={0.01}
          value={args[4]}
          onChange={(value: [number, number]) => this.updateArgs(4, value)}
        />
        <h4>Intensity range</h4>
        <Slider
          disabled
          marks={{ 0: '0', 127: '127', 255: '255' }}
          range
          max={255}
          value={args[4]}
          onChange={(value: [number, number]) => this.updateArgs(4, value)}
        />
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
          max={10}
          value={args[5]}
          onChange={(value) => this.updateArgs(5, value)}
        />
        <h4>Return image</h4>
        <Select
          value={args[6]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(6, value)}
        >
          <Option value={0}>Overlay (Colour)</Option>
          <Option value={1}>Contours only</Option>
          <Option value={2}>Original image</Option>
        </Select>
      </>
    );
  }
}
