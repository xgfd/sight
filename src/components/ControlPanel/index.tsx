import { Operation } from '../../type';
import AdaptiveThresholdControls from './AdaptiveThreshold';
import AddWeightedControls from './AddWeighted';
import BilateralControls from './BilateralFilter';
import BitwiseAndControls from './BitwiseAnd';
import BitwiseOrControls from './BitwiseOr';
import BlurControls from './Blur';
import BoxFilterControls from './BoxFilter';
import CannyControls from './Canny';
import CircleROIControls from './CircleROI';
import ControlsBase from './ControlsBase';
import ConvertScaleAbsControls from './ConvertScaleAbs';
import ConvexHullControls from './ConvexHull';
import CvtColorControls from './CvtColor';
import DefaultControls from './Default';
import DistanceTransformControls from './DistanceTransform';
import DivideControls from './Divide';
import EqualizeHistControls from './EqualizeHist';
import ExpandDimensionControls from './ExpandDimension';
import FilterCircleControls from './FilterCircle';
import FilterContoursControls from './FilterContours';
import FilterEllipseControls from './FilterEllipse';
import FindContoursControls from './FindContours';
import FitEllipseControls from './FitEllipse';
import GammaCorrectionControls from './GammaCorrection';
import GaussianControls from './GaussianBlur';
import GenAdptThControls from './GenAdptTh';
import HistogramControls from './Histogram';
import ImreadControls from './Imread';
import InRangeControls from './InRange';
import InscribedCircleControls from './InscribedCircle';
import MapContoursControls from './MapContours';
import MedianControls from './MedianBlur';
import MinEnclosingCircleControls from './MinEnclosingCircle';
import MorphologyExControls from './MorphologyEx';
import NormalizeControls from './Normalize';
import ReduceContoursControls from './ReduceContours';
import RefImageControls from './RefImage';
import SobelControls from './Sobel';
import ThresholdControls from './Threshold';
import WarpPolarControls from './WarpPolar';

const controlComponents: { [key: string]: typeof ControlsBase } = {
  adaptivethreshold: AdaptiveThresholdControls,
  addweighted: AddWeightedControls,
  blur: BlurControls,
  boxfilter: BoxFilterControls,
  bitwise_and: BitwiseAndControls,
  bitwise_or: BitwiseOrControls,
  bilateralfilter: BilateralControls,
  canny: CannyControls,
  refimage: RefImageControls,
  convertscaleabs: ConvertScaleAbsControls,
  convexhull: ConvexHullControls,
  circleroi: CircleROIControls,
  cvtcolor: CvtColorControls,
  distancetransform: DistanceTransformControls,
  divide: DivideControls,
  euqalizehist: EqualizeHistControls,
  expanddimension: ExpandDimensionControls,
  findcontours: FindContoursControls,
  filtercircle: FilterCircleControls,
  filterellipse: FilterEllipseControls,
  filtercontours: FilterContoursControls,
  fitellipse: FitEllipseControls,
  gaussianblur: GaussianControls,
  gammacorrection: GammaCorrectionControls,
  genadptth: GenAdptThControls,
  histogram: HistogramControls,
  imread: ImreadControls,
  inrange: InRangeControls,
  inscribedcircle: InscribedCircleControls,
  normalize: NormalizeControls,
  mapcontours: MapContoursControls,
  minenclosingcircle: MinEnclosingCircleControls,
  medianblur: MedianControls,
  morphologyex: MorphologyExControls,
  reducecontours: ReduceContoursControls,
  sobel: SobelControls,
  threshold: ThresholdControls,
  warppolar: WarpPolarControls,
};

export default function getControlComponent(op: Operation) {
  const { name } = op;
  let component;
  try {
    component = controlComponents[name.toLowerCase()] || DefaultControls;
  } catch (e) {
    component = DefaultControls;
  }
  return component;
}
