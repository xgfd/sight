import { InputNumber, Slider, Switch, Select } from 'antd';
import React from 'react';
import DefaultControls from './Default';

const { Option } = Select;

export default class SobelControls extends DefaultControls {
  static defaultValues = [-1, 1, 0, 3, 1, 0];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Output depth</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <Option value={-1}>Unchanged</Option>
          <Option value={0}>CV_8U</Option>
          <Option value={2}>CV_16U</Option>
          <Option value={3}>CV_16S</Option>
          <Option value={5}>CV_32F</Option>
          <Option value={6}>CV_64F</Option>
        </Select>
        <h4>dx, dy</h4>
        <Switch
          checked={args[1] === 1}
          onChange={(checked) => {
            const newDx = checked ? 1 : 0;
            this.updateArgs(1, checked ? 1 : 0);

            const dy = args[2];
            if (dy + newDx === 0) {
              this.updateArgs(2, 1);
            }
          }}
        />
        <span> </span>
        <Switch
          checked={args[2] === 1}
          onChange={(checked) => {
            const newDy = checked ? 1 : 0;
            this.updateArgs(2, checked ? 1 : 0);

            const dx = args[1];
            if (dx + newDy === 0) {
              this.updateArgs(1, 1);
            }
          }}
        />
        <h4>K-Size</h4>
        <Slider
          marks={{
            1: '1',
            3: '3',
            5: '5',
            7: '7',
          }}
          min={1}
          max={7}
          step={2}
          value={args[3]}
          onChange={(value: number) => this.updateArgs(3, value)}
        />
        <h4>Scale</h4>
        <InputNumber
          min={1}
          max={100}
          value={args[4]}
          onChange={(value) => this.updateArgs(4, value)}
        />
        <h4>Delta</h4>
        <InputNumber
          min={0}
          max={255}
          value={args[5]}
          onChange={(value) => this.updateArgs(5, value)}
        />
      </>
    );
  }
}