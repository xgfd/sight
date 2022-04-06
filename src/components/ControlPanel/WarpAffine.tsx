import { Col, InputNumber, Row, Select, Switch } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

interface MatrixProps {
  onChange: (value: number, index: number) => void;
  values: number[];
  step: number;
}
const MatrixComponent = (props: MatrixProps) => (
  <>
    <Row>
      <Col span={8}>
        <InputNumber
          size="small"
          style={{ width: 66 }}
          step={props.step}
          value={props.values[0]}
          onChange={(value) => props.onChange(value, 0)}
        />
      </Col>
      <Col span={8}>
        <InputNumber
          size="small"
          style={{ width: 66 }}
          step={props.step}
          value={props.values[1]}
          onChange={(value) => props.onChange(value, 1)}
        />
      </Col>
      <Col span={8}>
        <InputNumber
          size="small"
          style={{ width: 66 }}
          step={10}
          value={props.values[2]}
          onChange={(value) => props.onChange(value, 2)}
        />
      </Col>
    </Row>
    <Row>
      <Col span={8}>
        <InputNumber
          size="small"
          style={{ width: 66 }}
          step={props.step}
          value={props.values[3]}
          onChange={(value) => props.onChange(value, 3)}
        />
      </Col>
      <Col span={8}>
        <InputNumber
          size="small"
          style={{ width: 66 }}
          step={props.step}
          value={props.values[4]}
          onChange={(value) => props.onChange(value, 4)}
        />
      </Col>
      <Col span={8}>
        <InputNumber
          size="small"
          style={{ width: 66 }}
          step={10}
          value={props.values[5]}
          onChange={(value) => props.onChange(value, 5)}
        />
      </Col>
    </Row>
  </>
);

export default class WarpAffineControls extends ControlsBase {
  static defaultValues = [[1, 0, 0, 0, 1, 0], 1, 0, 4, 0];

  render() {
    const { name, args } = this.state;
    const warpMatrix: number[] = [...args[0]];
    return (
      <>
        <h2>{name}</h2>
        <h4>Warp matrix</h4>
        <MatrixComponent
          values={warpMatrix}
          step={0.1}
          onChange={(value, index) => {
            warpMatrix[index] = value;
            this.updateArgs(0, warpMatrix);
          }}
        />
        <h4>Interpolation method</h4>
        <Select
          value={args[1]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(1, value)}
        >
          <Option value={0}>NEAREST</Option>
          <Option value={1}>LINEAR</Option>
          <Option value={2}>CUBIC</Option>
          <Option value={3}>AREA</Option>
          <Option value={4}>LANCZOS4</Option>
          <Option value={5}>LINEAR_EXACT</Option>
          <Option value={6}>NEAREST_EXACT</Option>
          <Option value={7}>MAX</Option>
        </Select>
        <h4>Inverse map</h4>
        <Switch
          checked={args[2] === 16}
          onChange={(checked) => {
            const inverseMap = checked ? 16 : 0;
            this.updateArgs(2, inverseMap);
          }}
        />
        <h4>Border mode</h4>
        <Select
          value={args[3]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(3, value)}
        >
          <Option value={4}>DEFAULT</Option>
          <Option value={0}>CONSTANT</Option>
          <Option value={1}>REPLICATE</Option>
          <Option value={2}>REFLECT</Option>
          <Option value={3}>WRAP</Option>
          <Option value={5}>TRANSPARENT</Option>
        </Select>
        <h4>Border value</h4>
        <h5>Only applicable when border mode is constant</h5>
        <InputNumber
          min={0}
          max={255}
          step={1}
          value={args[4]}
          onChange={(value) => this.updateArgs(4, value)}
        />
      </>
    );
  }
}
