import BilateralControls from './BilateralFilter';
import Blur from './Blur';
import BoxFilter from './BoxFilter';
import Canny from './Canny';
import DefaultControls, { Operation } from './Default';
import GaussianControls from './GaussianBlur';
import Imread from './Imread';
import MedianControls from './MedianBlur';

const controlComponents: { [key: string]: typeof DefaultControls } = {
  imread: Imread,
  blur: Blur,
  boxfilter: BoxFilter,
  bilateralfilter: BilateralControls,
  medianblur: MedianControls,
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
