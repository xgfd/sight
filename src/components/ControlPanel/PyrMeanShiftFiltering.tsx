import { SelectOutlined } from '@ant-design/icons';
import { Divider, InputNumber, Slider, Typography } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Text, Link } = Typography;

export default class PyrMeanShiftFilteringControls extends ControlsBase {
  static defaultValues = [20, 50, 1];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>
          <Text ellipsis={{ tooltip: name }}>{name}</Text>
        </h2>
        <Text>see docs at OpenCV </Text>
        <Link
          target="_blank"
          href="https://docs.opencv.org/4.5.5/d4/d86/group__imgproc__filter.html#ga9fabdce9543bd602445f5db3827e4cc0"
          ellipsis
        >
          <SelectOutlined />
        </Link>
        <Divider />
        <h4>Spatial window radius (sp)</h4>
        <Slider
          marks={{ 0: '0', 128: '128', 255: '255' }}
          min={0}
          max={255}
          value={args[0]}
          onChange={(value: number) => this.updateArgs(0, value)}
        />
        <h4>Color window radius (sr)</h4>
        <Slider
          marks={{ 0: '0', 100: '100', 200: '200', 300: '300', 442: '442' }}
          min={0}
          max={442}
          value={args[1]}
          onChange={(value: number) => this.updateArgs(1, value)}
        />
        <h4>Maximum level of the pyramid</h4>
        <InputNumber
          min={0}
          max={5}
          value={args[2]}
          onChange={(value) => this.updateArgs(2, value)}
        />
      </>
    );
  }
}
