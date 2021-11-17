import { InputNumber, Select, Slider } from 'antd';
import React from 'react';
import BitwiseAndControls from './BitwiseAnd';

const { Option } = Select;

export default class FilterIntensityControls extends BitwiseAndControls {
  static defaultValues = [
    [0, 255] as [number, number],
    [0, 255] as [number, number],
    [0, 255] as [number, number],
    [0, 255] as [number, number],
    2,
    1,
  ];

  static defaultInputRefs = [''];

  render() {
    const { operations, index } = this.props;
    const { name, args } = this.state;
    let { inputRefs } = this.state;
    const allIDs = operations.map((op) => op.id);
    inputRefs = inputRefs.map((id) => (allIDs.includes(id) ? id : ''));
    return (
      <>
        <h2>{name}</h2>
        <h4>Image 1</h4>
        <Select
          value={inputRefs[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateExtraInputs(0, value)}
        >
          {operations.slice(0, index).map((op, i) => (
            <Option key={op.id} value={op.id}>{`${i}-${op.name}`}</Option>
          ))}
        </Select>
        <h4>Mean intensity range</h4>
        <Slider
          marks={{ 0: '0', 128: '128', 255: '255' }}
          range
          max={255}
          step={1}
          value={args[0]}
          onChange={(value: [number, number]) => this.updateArgs(0, value)}
        />
        <h4>Min intensity range</h4>
        <Slider
          marks={{ 0: '0', 128: '128', 255: '255' }}
          range
          max={255}
          step={1}
          value={args[1]}
          onChange={(value: [number, number]) => this.updateArgs(1, value)}
        />
        <h4>Max intensity range</h4>
        <Slider
          marks={{ 0: '0', 128: '128', 255: '255' }}
          range
          max={255}
          step={1}
          value={args[2]}
          onChange={(value: [number, number]) => this.updateArgs(2, value)}
        />
        <h4>Intensity std. range</h4>
        <Slider
          marks={{ 0: '0', 128: '128', 255: '255' }}
          range
          max={255}
          step={1}
          value={args[3]}
          onChange={(value: [number, number]) => this.updateArgs(3, value)}
        />
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
          value={args[4]}
          onChange={(value) => this.updateArgs(4, value)}
        />
        <h4>Return image</h4>
        <Select
          value={args[5]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(5, value)}
        >
          <Option value={0}>Overlay (Colour)</Option>
          <Option value={1}>Contours only</Option>
          <Option value={2}>Original image</Option>
        </Select>
      </>
    );
  }
}
