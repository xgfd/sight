import { Col, InputNumber, Row, Select, Slider } from 'antd';
import React from 'react';
import DefaultControls, { OpControlsProp, OpControlsState } from './Default';

const { Option } = Select;

interface FCState extends OpControlsState {
  areaMax: number;
  boundAreaMax: number;
  lengthMax: number;
}

export default class FilterContoursControls extends DefaultControls<
  OpControlsProp,
  FCState
> {
  static defaultValues = [
    [25, 500] as [number, number],
    [25, 500] as [number, number],
    [5, 100] as [number, number],
    [0.01, 1] as [number, number],
    [0, 128] as [number, number],
    2,
    1,
  ];

  constructor(props: OpControlsProp) {
    super(props);
    const { selectedOp } = props;
    const { args } = selectedOp;
    const areaHigh = args[2][1];
    const boundHigh = args[3][1];
    const lengthHigh = args[4][1];
    this.state = {
      ...this.state,
      areaMax: Math.ceil(areaHigh / 1000) * 2 * 1000,
      boundAreaMax: Math.ceil(boundHigh / 1000) * 2 * 1000,
      lengthMax: Math.ceil(lengthHigh / 200) * 2 * 200,
    };
  }

  render() {
    const { name, args, areaMax, boundAreaMax, lengthMax } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Area range</h4>
        <Row>
          <Col span={15}>
            <Slider
              marks={{ 0: '0' }}
              range
              max={areaMax}
              value={args[0]}
              onChange={(value: [number, number]) => this.updateArgs(0, value)}
            />
          </Col>
          <Col span={9}>
            <InputNumber
              size="small"
              style={{ width: 85 }}
              min={1000}
              step={1000}
              bordered={false}
              defaultValue={areaMax}
              onChange={(value) => this.setState({ areaMax: value as number })}
            />
          </Col>
        </Row>
        <h4>Bound area range</h4>
        <Row>
          <Col span={15}>
            <Slider
              marks={{ 0: '0' }}
              range
              max={boundAreaMax}
              value={args[1]}
              onChange={(value: [number, number]) => this.updateArgs(1, value)}
            />
          </Col>
          <Col span={9}>
            <InputNumber
              size="small"
              style={{ width: 85 }}
              min={1000}
              step={1000}
              bordered={false}
              defaultValue={boundAreaMax}
              onChange={(value) =>
                this.setState({ boundAreaMax: value as number })
              }
            />
          </Col>
        </Row>
        <h4>Length range</h4>
        <Row>
          <Col span={15}>
            <Slider
              marks={{ 0: '0' }}
              range
              max={lengthMax}
              value={args[2]}
              onChange={(value: [number, number]) => this.updateArgs(2, value)}
            />
          </Col>
          <Col span={9}>
            <InputNumber
              size="small"
              style={{ width: 85 }}
              min={200}
              step={200}
              bordered={false}
              defaultValue={lengthMax}
              onChange={(value) =>
                this.setState({ lengthMax: value as number })
              }
            />
          </Col>
        </Row>
        <h4>Aspect range</h4>
        <Slider
          marks={{ 0: '0', 0.5: '.5', 1: '1' }}
          range
          max={1}
          step={0.01}
          value={args[3]}
          onChange={(value: [number, number]) => this.updateArgs(3, value)}
        />
        <h4>Intensity range</h4>
        <Slider
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
