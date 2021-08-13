import { InputNumber, Select, Typography } from 'antd';
import React from 'react';
import BitwiseAndControls from './BitwiseAnd';

const { Option } = Select;
const { Text } = Typography;

export default class MatchTemplateControls extends BitwiseAndControls {
  static defaultValues = [0];

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
        <h4>Template</h4>
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
        <h4>Contour mode</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value={0}>TM_SQDIFF</Option>
          <Option value={1}>TM_SQDIFF_NORMED</Option>
          <Option value={2}>TM_CCORR</Option>
          <Option value={3}>TM_CCORR_NORMED</Option>
          <Option value={4}>TM_CCOEFF</Option>
          <Option value={5}>TM_CCOEFF_NORMED</Option>
        </Select>
      </>
    );
  }
}
