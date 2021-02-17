import React from 'react';
import DefaultControls from './Default';

export default class EqualizeHistControls extends DefaultControls {
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
