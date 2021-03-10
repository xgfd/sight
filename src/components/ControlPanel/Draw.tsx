import { InputNumber, Select } from 'antd';
import React from 'react';
import BitwiseAndControls from './BitwiseAnd';

const { Option } = Select;

export default class DrawControls extends BitwiseAndControls {
  static defaultValues = ['auto', 2, 1];

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
        <h4>Method</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value="auto">auto</Option>
          <Option value="ellipses">ellipses</Option>
          <Option value="contours">contours</Option>
          <Option value="circles">circles</Option>
          <Option value="rectangles">rectangles</Option>
          <Option value="triangles">triangles</Option>
          <Option value="rotated rectangles">rotated rectangles</Option>
        </Select>
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
