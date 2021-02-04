import DefaultControls, { Operation } from './Default';
import Imread from './Imread';
import Canny from './Canny';

const controlComponents: { [key: string]: typeof DefaultControls } = {
  imread: Imread,
  canny: Canny,
};

export default function createControlComponent(op: Operation) {
  const { name } = op;
  let component;
  try {
    component = controlComponents[name] || DefaultControls;
  } catch (e) {
    component = DefaultControls;
  }
  return component;
}
