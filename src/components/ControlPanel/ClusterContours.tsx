import { Col, InputNumber, Row, Select, Slider } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

export default class ClusterContoursControls extends ControlsBase {
  static defaultValues = ['ward', 5, 2, 1];

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
        <h4>Linkage Criterion</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value="ward">ward</Option>
          <Option value="complete">complete</Option>
          <Option value="average">average</Option>
          <Option value="single">single</Option>
        </Select>
        <h4>Distance threshold</h4>
        <Slider
          marks={{
            0: '0',
            100: '100',
            200: '200',
            300: '300',
            400: '400',
            500: '500',
          }}
          min={0}
          max={500}
          step={1}
          value={args[1]}
          onChange={(value: number) => this.updateArgs(1, value)}
        />
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
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
