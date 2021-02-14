import AdaptiveThresholdControls from './AdaptiveThreshold';
import BilateralControls from './BilateralFilter';
import BlurControls from './Blur';
import BoxFilterControls from './BoxFilter';
import CannyControls from './Canny';
import ControlsBase from './ControlsBase';
import DefaultControls, { Operation } from './Default';
import FindContoursControls from './FindContours';
import GaussianControls from './GaussianBlur';
import Imread from './Imread';
import InRangeControls from './InRange';
import InscribedCircleControls from './InscribedCircle';
import MedianControls from './MedianBlur';
import MorphologyExControls from './MorphologyEx';
import ThresholdControls from './Threshold';

const controlComponents: { [key: string]: typeof ControlsBase } = {
  adaptivethreshold: AdaptiveThresholdControls,
  blur: BlurControls,
  boxfilter: BoxFilterControls,
  bilateralfilter: BilateralControls,
  canny: CannyControls,
  findcontours: FindContoursControls,
  gaussianblur: GaussianControls,
  imread: Imread,
  inrange: InRangeControls,
  inscribedcircle: InscribedCircleControls,
  medianblur: MedianControls,
  morphologyex: MorphologyExControls,
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
