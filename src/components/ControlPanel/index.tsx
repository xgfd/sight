import BilateralControls from './BilateralFilter';
import Blur from './Blur';
import BoxFilter from './BoxFilter';
import Canny from './Canny';
import DefaultControls, { Operation } from './Default';
import GaussianControls from './GaussianBlur';
import ThresholdControls from './Threshold';
import AdaptiveThresholdControls from './AdaptiveThreshold';
import Imread from './Imread';
import MedianControls from './MedianBlur';

const controlComponents: { [key: string]: typeof DefaultControls } = {
  adaptivethreshold: AdaptiveThresholdControls,
  blur: Blur,
  boxfilter: BoxFilter,
  bilateralfilter: BilateralControls,
  canny: Canny,
  gaussianblur: GaussianControls,
  imread: Imread,
  medianblur: MedianControls,
  threshold: ThresholdControls,
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
