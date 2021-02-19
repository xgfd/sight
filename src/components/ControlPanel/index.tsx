import AdaptiveThresholdControls from './AdaptiveThreshold';
import BilateralControls from './BilateralFilter';
import BlurControls from './Blur';
import BoxFilterControls from './BoxFilter';
import CannyControls from './Canny';
import CircleROIControls from './CircleROI';
import ControlsBase from './ControlsBase';
import ConvertScaleAbsControls from './ConvertScaleAbs';
import ConvexHullsControls from './ConvexHulls';
import CustomFindContours from './CustomFindContours';
import DefaultControls, { Operation } from './Default';
import EqualizeHistControls from './EqualizeHist';
import FilterContoursControls from './FilterContours';
import FindContoursControls from './FindContours';
import FitEllipsesControls from './FitEllipses';
import GammaCorrectionControls from './GammaCorrection';
import GaussianControls from './GaussianBlur';
import ImreadControls from './Imread';
import InRangeControls from './InRange';
import InscribedCircleControls from './InscribedCircle';
import MapContoursControls from './MapContours';
import MedianControls from './MedianBlur';
import MinEnclosingCirclesControls from './MinEnclosingCircle';
import MorphologyExControls from './MorphologyEx';
import NormalizeControls from './Normalize';
import ReduceContoursControls from './ReduceContours';
import SobelControls from './Sobel';
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
  customfindcontours: CustomFindContours,
  circleroi: CircleROIControls,
  euqalizehist: EqualizeHistControls,
  findcontours: FindContoursControls,
  filtercontours: FilterContoursControls,
  fitellipses: FitEllipsesControls,
  gaussianblur: GaussianControls,
  gammacorrection: GammaCorrectionControls,
  imread: ImreadControls,
  inrange: InRangeControls,
  inscribedcircle: InscribedCircleControls,
  normalize: NormalizeControls,
  mapcontours: MapContoursControls,
  minenclosingcircles: MinEnclosingCirclesControls,
  medianblur: MedianControls,
  morphologyex: MorphologyExControls,
  reducecontours: ReduceContoursControls,
  sobel: SobelControls,
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
