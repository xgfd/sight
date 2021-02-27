import { Select } from 'antd';
import React from 'react';
import BitwiseAndControls from './BitwiseAnd';

const { Option } = Select;

export default class BitwiseOrControls extends BitwiseAndControls {
  render() {
    const { operations, index } = this.props;
    const { name, inputRefs } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Image 2</h4>
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
      </>
    );
  }
}
