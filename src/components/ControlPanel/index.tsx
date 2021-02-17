import AdaptiveThresholdControls from './AdaptiveThreshold';
import BilateralControls from './BilateralFilter';
import BlurControls from './Blur';
import BoxFilterControls from './BoxFilter';
import CannyControls from './Canny';
import CircleROIControls from './CircleROI';
import ControlsBase from './ControlsBase';
import ConvertScaleAbsControls from './ConvertScaleAbs';
import ConvexHullsControls from './ConvexHulls';
import DefaultControls, { Operation } from './Default';
import EqualizeHistControls from './EqualizeHist';
import FindContoursControls from './FindContours';
import FitEllipsesControls from './FitEllipses';
import GaussianControls from './GaussianBlur';
import ImreadControls from './Imread';
import InRangeControls from './InRange';
import InscribedCircleControls from './InscribedCircle';
import MedianControls from './MedianBlur';
import MinEnclosingCirclesControls from './MinEnclosingCircle';
import MorphologyExControls from './MorphologyEx';
import ThresholdControls from './Threshold';
import WarpPolarControls from './WarpPolar';

const controlComponents: { [key: string]: typeof ControlsBase } = {
  adaptivethreshold: AdaptiveThresholdControls,
  blur: BlurControls,
  boxfilter: BoxFilterControls,
  bilateralfilter: BilateralControls,
  canny: CannyControls,
  convertscaleabs: ConvertScaleAbsControls,
  convexhulls: ConvexHullsControls,
  circleroi: CircleROIControls,
  euqalizehist: EqualizeHistControls,
  findcontours: FindContoursControls,
  fitellipses: FitEllipsesControls,
  gaussianblur: GaussianControls,
  imread: ImreadControls,
  inrange: InRangeControls,
  inscribedcircle: InscribedCircleControls,
  minenclosingcircles: MinEnclosingCirclesControls,
  medianblur: MedianControls,
  morphologyex: MorphologyExControls,
  threshold: ThresholdControls,
  warppolar: WarpPolarControls,
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
