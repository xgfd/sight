import Icon, {
  BarChartOutlined,
  BlockOutlined,
  BuildOutlined,
  CalculatorOutlined,
  ColumnHeightOutlined,
  ExpandOutlined,
  FieldBinaryOutlined,
  FileImageOutlined,
  FilterOutlined,
  FunctionOutlined,
  ToolOutlined,
  GlobalOutlined,
  HeatMapOutlined,
  HighlightOutlined,
  LoginOutlined,
  LogoutOutlined,
  MergeCellsOutlined,
  PauseOutlined,
  RadarChartOutlined,
  RiseOutlined,
  SplitCellsOutlined,
  PartitionOutlined,
  UngroupOutlined,
} from '@ant-design/icons';
import { Typography } from 'antd';
import React from 'react';
import OpItem from '../Operation';

const { Text } = Typography;

const IconMap: { [key: string]: React.ReactNode } = {
  add: <CalculatorOutlined />,
  annotation: <HighlightOutlined />,
  bitwise_and: <BlockOutlined />,
  bitwise_or: <BlockOutlined />,
  bitwise_xor: <BlockOutlined />,
  boxblur: <ExpandOutlined />,
  bilateralfilter: <PauseOutlined />,
  canny: <HeatMapOutlined />,
  convertscaleabs: <RiseOutlined />,
  crop: <ExpandOutlined />,
  contours: <HeatMapOutlined />,
  dilate: <SplitCellsOutlined />,
  divide: <CalculatorOutlined />,
  erode: <MergeCellsOutlined />,
  equalizehist: <BarChartOutlined />,
  filter2d: <BlockOutlined />,
  filter: <BuildOutlined />,
  findcontours: <RadarChartOutlined />,
  filtercontours: <FilterOutlined />,
  gaussianblur: <UngroupOutlined />,
  histogram: <BarChartOutlined />,
  imread: <FileImageOutlined />,
  inrange: <ColumnHeightOutlined />,
  inscribedcircle: <LogoutOutlined />,
  mapcontours: <FunctionOutlined />,
  minenclosingcircle: <LoginOutlined />,
  multiply: <CalculatorOutlined />,
  reducecontours: <PartitionOutlined rotate={180} />,
  subtract: <CalculatorOutlined />,
  threshold: <FieldBinaryOutlined />,
  warppolar: <GlobalOutlined />,
};

export default function getIcon(op: OpItem): React.ReactNode {
  let icon;
  if (op.package === 'custom') {
    icon = <ToolOutlined />;
  } else {
    // for builtin functions read from the icon map or use its first letter
    icon = IconMap[op.name.toLowerCase()] || (
      <Icon component={() => <Text strong>{op.name[0].toUpperCase()}</Text>} />
    );
  }
  return icon;
}
