import Canny from './Canny';
import GaussianControls from './GaussianBlur';
import DefaultControls, { Operation } from './Default';
import Imread from './Imread';

const controlComponents: { [key: string]: typeof DefaultControls } = {
  imread: Imread,
  canny: Canny,
  gaussianblur: GaussianControls,
};

export default function createControlComponent(op: Operation) {
  const { name } = op;
  let component;
  try {
    component = controlComponents[name.toLowerCase()] || DefaultControls;
  } catch (e) {
    component = DefaultControls;
  }
  return component;
}
