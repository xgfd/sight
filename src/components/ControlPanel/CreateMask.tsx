import { InputNumber, Select, Slider } from 'antd';
import React from 'react';
import { BlockPicker } from 'react-color';
import BitwiseAndControls from './BitwiseAnd';

const { Option } = Select;

export default class CreateMaskControls extends BitwiseAndControls {
  static defaultValues = ['ellipse', 0, 0, 100, 100, 0, [110, 0, 255], 2, 0];

  static defaultInputRefs = [''];

  render() {
    const { operations, index } = this.props;
    const { name, args } = this.state;
    let { inputRefs } = this.state;
    const allIDs = operations.map((op) => op.id);
    inputRefs = inputRefs.map((id) => (allIDs.includes(id) ? id : ''));
    const [b, g, r] = args[6];
    return (
      <>
        <h2>{name}</h2>
        <h4>Image</h4>
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
        <h4>Shape</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value="ellipse">ellipse</Option>
          <Option value="rectangle">rectangle</Option>
        </Select>
        <h4>Centre (x, y)</h4>
        <Slider
          marks={{ 0: '0', 1000: '1k', 2000: '2k', 3000: '3k' }}
          max={3000}
          value={args[1]}
          onChange={(value: number) => this.updateArgs(1, value)}
        />
        <Slider
          marks={{ 0: '0', 1000: '1k', 2000: '2k', 3000: '3k' }}
          max={3000}
          value={args[2]}
          onChange={(value: number) => this.updateArgs(2, value)}
        />
        <InputNumber
          min={0}
          step={10}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <InputNumber
          min={0}
          step={10}
          value={args[2]}
          onChange={(value) => this.updateArgs(2, value)}
        />
        <h4>Width</h4>
        <Slider
          marks={{ 0: '0', 1000: '1k', 2000: '2k', 3000: '3k' }}
          max={3000}
          value={args[3]}
          onChange={(value: number) => this.updateArgs(3, value)}
        />
        <InputNumber
          min={0}
          step={10}
          value={args[3]}
          onChange={(value) => this.updateArgs(3, value)}
        />
        <h4>Height</h4>
        <Slider
          marks={{ 0: '0', 1000: '1k', 2000: '2k', 3000: '3k' }}
          max={3000}
          value={args[4]}
          onChange={(value: number) => this.updateArgs(4, value)}
        />
        <InputNumber
          min={0}
          step={10}
          value={args[4]}
          onChange={(value) => this.updateArgs(4, value)}
        />
        <h4>Angle</h4>
        <Slider
          marks={{ 0: '0°', 45: '45°', 90: '90°' }}
          max={90}
          value={args[5]}
          onChange={(value: number) => this.updateArgs(5, value)}
        />
        <h4>Colour</h4>
        <BlockPicker
          triangle="hide"
          colors={[
            '#03bd42',
            '#b1eb1e',
            '#ff1b1c',
            '#ff006e',
            '#ff7f11',
            '#8338ec',
            '#3a86ff',
            '#ffffff',
            '#beb7a4',
            '#000000',
          ]}
          color={{ b, g, r }}
          onChangeComplete={(colour) => {
            const { b: nb, g: ng, r: nr } = colour.rgb;
            this.updateArgs(6, [nb, ng, nr]);
          }}
        />
        <h4>Line thickness</h4>
        <InputNumber
          min={-1}
          value={args[7]}
          onChange={(value) => this.updateArgs(7, value)}
        />
        <h4>Return image</h4>
        <Select
          value={args[8]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(8, value)}
        >
          <Option value={0}>Overlay (Colour)</Option>
          <Option value={3}>Overlay (Gray)</Option>
          <Option value={1}>Mask only</Option>
          <Option value={2}>Original image</Option>
        </Select>
      </>
    );
  }
}
