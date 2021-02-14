import { Input, InputNumber, Slider, Switch } from 'antd';
import React, { Component } from 'react';
import ControlsBase from './ControlsBase';

// cannot import from Operation due to circular dependency
declare interface Operation {
  id: string;
  name: string;
  args: any[];
  updateArgs: (index: number, value: any) => void;
}

interface OpControlsProp {
  selectedOp: Operation;
  onChange: (index?: number) => void;
}

interface OpControlsState {
  name: string;
  args: any[];
  live: boolean;
}

export { OpControlsProp, OpControlsState, Operation };

export default class DefaultControls<
  T extends OpControlsProp = OpControlsProp, // generic parameter defaults introduced in TS v2.3
  K extends OpControlsState = OpControlsState
> extends ControlsBase<T, K> {
  static defaultValues = [[50, 150] as [number, number], 3, 3, 0, 0, '', false];

  constructor(props: T) {
    super(props);
    const { selectedOp } = props;
    const { name, args } = selectedOp;
    this.state = { name, args: [...args], live: true } as K;
  }

  updateArgs(index: number, value: any) {
    const { selectedOp, onChange } = this.props;
    selectedOp.updateArgs(index, value);
    this.setState({ name: selectedOp.name, args: selectedOp.args });
    const { live } = this.state;
    if (live) {
      onChange();
    }
  }

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Thresholds</h4>
        <Slider
          range
          max={360}
          value={args[0]}
          onChange={(value: [number, number]) => this.updateArgs(0, value)}
        />
        <h4>Kernel row</h4>
        <InputNumber
          min={3}
          max={255}
          step={2}
          value={args[1]}
          onChange={(value) => this.updateArgs(1, value)}
        />
        <h4>Kernel column</h4>
        <InputNumber
          min={3}
          max={255}
          step={2}
          value={args[2]}
          onChange={(value) => this.updateArgs(2, value)}
        />
        <h4>Int arg 1</h4>
        <InputNumber
          min={-1}
          max={255}
          step={1}
          value={args[3]}
          onChange={(value) => this.updateArgs(3, value)}
        />
        <h4>Int arg 2</h4>
        <InputNumber
          min={-1}
          max={255}
          step={1}
          value={args[4]}
          onChange={(value) => this.updateArgs(4, value)}
        />
        <h4>Str arg</h4>
        <Input
          value={args[5]}
          onChange={(value) => this.updateArgs(5, value)}
        />
        <h4>Boolean arg</h4>
        <Switch
          checked={args[6]}
          onChange={(checked) => this.updateArgs(6, checked)}
        />
      </>
    );
  }
}
