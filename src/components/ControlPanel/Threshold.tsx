import { InputNumber, Select, Slider, Switch } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option } = Select;

// bit mask for Otsu threshholding
const OtsuMask = 8;

// bit mask for Triangle threshholding
const TriangleMask = 16;

function checkBit(val: number, mask: number) {
  /* eslint-disable-next-line no-bitwise */
  return (val & mask) !== 0;
}

function setBit(val: number, mask: number) {
  /* eslint-disable-next-line no-bitwise */
  return val | mask;
}

function clearBit(val: number, mask: number) {
  /* eslint-disable-next-line no-bitwise */
  return val & ~mask;
}

export default class ThresholdControls extends ControlsBase {
  static defaultValues = [127, 255, 0];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Threshold</h4>
        <Slider
          marks={{ 0: '0', 127: '127', 255: '255' }}
          min={0}
          max={255}
          value={args[0]}
          onChange={(value: number) => this.updateArgs(0, value)}
        />
        <h4>Max value</h4>
        <InputNumber
          min={0}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <h4>Threshold type</h4>
        <Select
          /* eslint-disable-next-line no-bitwise */
          value={args[2] & 7}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(2, value)}
        >
          <Option value={0}>BINARY</Option>
          <Option value={1}>BINARY_INV</Option>
          <Option value={2}>TRUNC</Option>
          <Option value={3}>TOZERO</Option>
          <Option value={4}>TOZERO_INV</Option>
        </Select>
        <h4>Use Otsu threshholding</h4>
        <Switch
          checked={checkBit(args[2], OtsuMask)}
          onChange={(checked) => {
            let threshType = args[2];
            if (checked) {
              // set Otsu mask and clear triangle mask
              threshType = setBit(threshType, OtsuMask);
              threshType = clearBit(threshType, TriangleMask);
            } else {
              threshType = clearBit(threshType, OtsuMask);
            }
            this.updateArgs(2, threshType);
          }}
        />
        <h4>Use triangle threshholding</h4>
        <Switch
          checked={checkBit(args[2], TriangleMask)}
          onChange={(checked) => {
            let threshType = args[2];
            if (checked) {
              // set triangle mask and clear Otsu mask
              threshType = setBit(threshType, TriangleMask);
              threshType = clearBit(threshType, OtsuMask);
            } else {
              threshType = clearBit(threshType, TriangleMask);
            }
            this.updateArgs(2, threshType);
          }}
        />
      </>
    );
  }
}
