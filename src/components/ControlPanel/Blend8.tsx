import { Select, Typography } from 'antd';
import React from 'react';
import BitwiseAndControls from './BitwiseAnd';

const { Option } = Select;
const { Text } = Typography;

export default class Blend8Controls extends BitwiseAndControls {
  static defaultValues = ['mean', 'uint8'];

  static defaultInputRefs = ['', '', '', '', '', '', '', ''];

  render() {
    const { operations, index } = this.props;
    const { name, args } = this.state;
    let { inputRefs } = this.state;
    const allIDs = operations.map((op) => op.id);
    inputRefs = inputRefs.map((id) => (allIDs.includes(id) ? id : ''));

    return (
      <>
        <h2>{name}</h2>
        <Text>Blend 8 images</Text>
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
        <h4>Image 2</h4>
        <Select
          value={inputRefs[1]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateExtraInputs(1, value)}
        >
          {operations.slice(0, index).map((op, i) => (
            <Option key={op.id} value={op.id}>{`${i}-${op.name}`}</Option>
          ))}
        </Select>
        <h4>Image 3</h4>
        <Select
          value={inputRefs[2]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateExtraInputs(2, value)}
        >
          {operations.slice(0, index).map((op, i) => (
            <Option key={op.id} value={op.id}>{`${i}-${op.name}`}</Option>
          ))}
        </Select>
        <h4>Image 4</h4>
        <Select
          value={inputRefs[3]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateExtraInputs(3, value)}
        >
          {operations.slice(0, index).map((op, i) => (
            <Option key={op.id} value={op.id}>{`${i}-${op.name}`}</Option>
          ))}
        </Select>
        <h4>Image 5</h4>
        <Select
          value={inputRefs[4]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateExtraInputs(4, value)}
        >
          {operations.slice(0, index).map((op, i) => (
            <Option key={op.id} value={op.id}>{`${i}-${op.name}`}</Option>
          ))}
        </Select>
        <h4>Image 6</h4>
        <Select
          value={inputRefs[5]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateExtraInputs(5, value)}
        >
          {operations.slice(0, index).map((op, i) => (
            <Option key={op.id} value={op.id}>{`${i}-${op.name}`}</Option>
          ))}
        </Select>
        <h4>Image 7</h4>
        <Select
          value={inputRefs[6]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateExtraInputs(6, value)}
        >
          {operations.slice(0, index).map((op, i) => (
            <Option key={op.id} value={op.id}>{`${i}-${op.name}`}</Option>
          ))}
        </Select>
        <h4>Image 8</h4>
        <Select
          value={inputRefs[7]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateExtraInputs(7, value)}
        >
          {operations.slice(0, index).map((op, i) => (
            <Option key={op.id} value={op.id}>{`${i}-${op.name}`}</Option>
          ))}
        </Select>
        <h4>Blend method</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value="mean">mean</Option>
          <Option value="min">min</Option>
          <Option value="max">max</Option>
        </Select>
        {/* <h4>dtype</h4>
        <Select
          value={args[1]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(1, value)}
        >
          <Option value="uint8">uint8</Option>
          <Option value="uint16">uint16</Option>
          <Option value="int16">int16</Option>
          <Option value="int32">int32</Option>
          <Option value="float32">float32</Option>
          <Option value="float64">float64</Option>
        </Select> */}
      </>
    );
  }
}
