import { InputNumber, Select, Typography } from 'antd';
import React from 'react';
import BitwiseAndControls from './BitwiseAnd';

const { Option } = Select;
const { Text } = Typography;

export default class AddWeightedControls extends BitwiseAndControls {
  static defaultValues = [0.5, 0.5, 0];

  static defaultInputRefs = ['', ''];

  render() {
    const { operations, index } = this.props;
    const { name, args } = this.state;
    let { inputRefs } = this.state;
    const allIDs = operations.map((op) => op.id);
    inputRefs = inputRefs.map((id) => (allIDs.includes(id) ? id : ''));

    return (
      <>
        <h2>{name}</h2>
        <Text code>saturate(img1*α+img2*β+γ)</Text>
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
        <h4>Alpha</h4>
        <InputNumber
          step={0.1}
          value={args[0]}
          onChange={(value) => this.updateArgs(0, value)}
        />
        <h4>Beta</h4>
        <InputNumber
          step={0.1}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <h4>Gamma</h4>
        <InputNumber
          value={args[2]}
          onChange={(value) => this.updateArgs(2, value)}
        />
      </>
    );
  }
}
