import { Switch } from 'antd';
import React from 'react';
import DefaultControls from './Default';

export default class HistogramControls extends DefaultControls {
  static defaultValues = [true];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Show histogram</h4>
        <Switch
          checked={args[0]}
          onChange={(checked) => this.updateArgs(0, checked)}
        />
      </>
    );
  }
}
