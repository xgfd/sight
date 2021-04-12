import { Operation } from '../../type';
import AdaptiveThresholdControls from './AdaptiveThreshold';
import AddControls from './Add';
import AddWeightedControls from './AddWeighted';
import BilateralControls from './BilateralFilter';
import BitwiseAndControls from './BitwiseAnd';
import BitwiseOrControls from './BitwiseOr';
import BlurControls from './Blur';
import BoundingRectControls from './BoundingRect';
import BoxFilterControls from './BoxFilter';
import CannyControls from './Canny';
import CircleROIControls from './CircleROI';
import ControlsBase from './ControlsBase';
import ConvertScaleAbsControls from './ConvertScaleAbs';
import ConvexHullControls from './ConvexHull';
import CvtColorControls from './CvtColor';
import DefaultControls from './Default';
import DeshadeControls from './Deshade';
import DistanceTransformControls from './DistanceTransform';
import DivideControls from './Divide';
import DrawControls from './Draw';
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
import GenHighpassControls from './GenHighpass';
import HighpassControls from './Highpass';
import HistogramControls from './Histogram';
import ImreadControls from './Imread';
import InRangeControls from './InRange';
import InscribedCircleControls from './InscribedCircle';
import MapContoursControls from './MapContours';
import MedianControls from './MedianBlur';
import MinEnclosingCircleControls from './MinEnclosingCircle';
import MorphologyExControls from './MorphologyEx';
import MultiplyControls from './Multiply';
import NormalizeControls from './Normalize';
import ReduceContoursControls from './ReduceContours';
import RefImageControls from './RefImage';
import ScharrControls from './Scharr';
import SobelControls from './Sobel';
import SobelAmpControls from './SobelAmp';
import SubtractControls from './Subtract';
import ThresholdControls from './Threshold';
import WarpPolarControls from './WarpPolar';

const controlComponents: { [key: string]: typeof ControlsBase } = {
  adaptivethreshold: AdaptiveThresholdControls,
  add: AddControls,
  addweighted: AddWeightedControls,
  blur: BlurControls,
  boxfilter: BoxFilterControls,
  boundingrect: BoundingRectControls,
  bitwise_and: BitwiseAndControls,
  bitwise_or: BitwiseOrControls,
  bilateralfilter: BilateralControls,
  canny: CannyControls,
  refimage: RefImageControls,
  convertscaleabs: ConvertScaleAbsControls,
  convexhull: ConvexHullControls,
  circleroi: CircleROIControls,
  cvtcolor: CvtColorControls,
  deshade: DeshadeControls,
  distancetransform: DistanceTransformControls,
  divide: DivideControls,
  draw: DrawControls,
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
  genhighpass: GenHighpassControls,
  highpass: HighpassControls,
  histogram: HistogramControls,
  imread: ImreadControls,
  inrange: InRangeControls,
  inscribedcircle: InscribedCircleControls,
  normalize: NormalizeControls,
  mapcontours: MapContoursControls,
  minenclosingcircle: MinEnclosingCircleControls,
  medianblur: MedianControls,
  morphologyex: MorphologyExControls,
  multiply: MultiplyControls,
  reducecontours: ReduceContoursControls,
  scharr: ScharrControls,
  sobel: SobelControls,
  sobelamp: SobelAmpControls,
  subtract: SubtractControls,
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
