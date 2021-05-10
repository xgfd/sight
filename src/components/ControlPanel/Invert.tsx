import React from 'react';
import ControlsBase from './ControlsBase';

export default class InRangeControls extends ControlsBase {
  static defaultValues = [];

  render() {
    const { name } = this.state;

    return (
      <>
        <h2>{name}</h2>
      </>
    );
  }
}
