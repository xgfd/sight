import AdaptiveThresholdControls from './AdaptiveThreshold';
import BilateralControls from './BilateralFilter';
import BlurControls from './Blur';
import BoxFilterControls from './BoxFilter';
import CannyControls from './Canny';
import DefaultControls, { Operation } from './Default';
import GaussianControls from './GaussianBlur';
import Imread from './Imread';
import InRangeControls from './InRange';
import MedianControls from './MedianBlur';
import ThresholdControls from './Threshold';

const controlComponents: { [key: string]: typeof DefaultControls } = {
  adaptivethreshold: AdaptiveThresholdControls,
  blur: BlurControls,
  boxfilter: BoxFilterControls,
  bilateralfilter: BilateralControls,
  canny: CannyControls,
  gaussianblur: GaussianControls,
  imread: Imread,
  inrange: InRangeControls,
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
