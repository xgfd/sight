import { Operation } from '../../type';
import AdaptiveThresholdControls from './AdaptiveThreshold';
import AddControls from './Add';
import AddWeightedControls from './AddWeighted';
import BilateralControls from './BilateralFilter';
import BitwiseAndControls from './BitwiseAnd';
import BitwiseOrControls from './BitwiseOr';
import BitwiseXorControls from './BitwiseXor';
import Blend8Controls from './Blend8';
import BlurControls from './Blur';
import BoundingRectControls from './BoundingRect';
import BoxFilterControls from './BoxFilter';
import CannyControls from './Canny';
import CircleROIControls from './CircleROI';
import ClusterContoursControls from './ClusterContours';
import ControlsBase, { OpControlsProp, OpControlsState } from './ControlsBase';
import ConvertScaleAbsControls from './ConvertScaleAbs';
import ConvexHullControls from './ConvexHull';
import CornerHarrisControls from './CornerHarris';
import CreateMaskControls from './CreateMask';
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
import FilterIntensityControls from './FilterIntensity';
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
import InvertControls from './Invert';
import LaplacianControls from './Laplacian';
import MapContoursControls from './MapContours';
import MatchTemplateControls from './MatchTemplate';
import MedianControls from './MedianBlur';
import MinEnclosingCircleControls from './MinEnclosingCircle';
import MorphologyExControls from './MorphologyEx';
import MultiplyControls from './Multiply';
import NonMaxSupressionControls from './NonMaxSupression';
import NormalizeControls from './Normalize';
import NpSum from './NpSum';
import PyrDownControls from './PyrDown';
import PyrMeanShiftFilteringControls from './PyrMeanShiftFiltering';
import PyrUpControls from './PyrUp';
import ReduceContoursControls from './ReduceContours';
import RefImageControls from './RefImage';
import ResizeControls from './Resize';
import RidgeFilterControls from './RidgeFilter';
import RotateControls from './Rotate';
import ScharrControls from './Scharr';
import SobelControls from './Sobel';
import SobelAmpControls from './SobelAmp';
import SubtractControls from './Subtract';
import ThresholdControls from './Threshold';
import TransformEllipseControls from './TransformEllipse';
import WarpPolarControls from './WarpPolar';

type ControlPanelType<P extends OpControlsProp, S extends OpControlsState> = {
  new (props: P): ControlsBase<P, S>;
  defaultValues: (string | number | boolean | number[])[];
  defaultInputRefs: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const controlComponents: { [key: string]: ControlPanelType<any, any> } = {
  adaptivethreshold: AdaptiveThresholdControls,
  add: AddControls,
  addweighted: AddWeightedControls,
  blend8: Blend8Controls,
  blur: BlurControls,
  boxfilter: BoxFilterControls,
  boundingrect: BoundingRectControls,
  bitwise_and: BitwiseAndControls,
  bitwise_or: BitwiseOrControls,
  bitwise_xor: BitwiseXorControls,
  bilateralfilter: BilateralControls,
  canny: CannyControls,
  createmask: CreateMaskControls,
  convertscaleabs: ConvertScaleAbsControls,
  convexhull: ConvexHullControls,
  cornerharris: CornerHarrisControls,
  circleroi: CircleROIControls,
  cvtcolor: CvtColorControls,
  deshade: DeshadeControls,
  distancetransform: DistanceTransformControls,
  divide: DivideControls,
  draw: DrawControls,
  clustercontours: ClusterContoursControls,
  euqalizehist: EqualizeHistControls,
  expanddimension: ExpandDimensionControls,
  findcontours: FindContoursControls,
  filtercircle: FilterCircleControls,
  filterellipse: FilterEllipseControls,
  filtercontours: FilterContoursControls,
  filterintensity: FilterIntensityControls,
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
  invert: InvertControls,
  laplacian: LaplacianControls,
  mapcontours: MapContoursControls,
  matchtemplate: MatchTemplateControls,
  minenclosingcircle: MinEnclosingCircleControls,
  medianblur: MedianControls,
  morphologyex: MorphologyExControls,
  multiply: MultiplyControls,
  nonmaxsupression: NonMaxSupressionControls,
  normalize: NormalizeControls,
  npsum: NpSum,
  pyrdown: PyrDownControls,
  pyrup: PyrUpControls,
  pyrmeanshiftfiltering: PyrMeanShiftFilteringControls,
  reducecontours: ReduceContoursControls,
  refimage: RefImageControls,
  ridgefilter: RidgeFilterControls,
  resize: ResizeControls,
  rotate: RotateControls,
  scharr: ScharrControls,
  sobel: SobelControls,
  sobelamp: SobelAmpControls,
  subtract: SubtractControls,
  threshold: ThresholdControls,
  transformellipse: TransformEllipseControls,
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
