import { Component } from 'react';

export default class ControlsBase<T, K> extends Component<T, K> {
  static defaultValues: (string | number | boolean | [number, number])[] = [];

  updatedArgs = (index: number, value: any) => {};
}
