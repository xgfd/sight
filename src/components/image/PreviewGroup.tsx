/* eslint react/jsx-props-no-spreading: "off" */
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import ZoomInOutlined from '@ant-design/icons/ZoomInOutlined';
import ZoomOutOutlined from '@ant-design/icons/ZoomOutOutlined';
import { Tooltip } from 'antd';
import { ConfigContext } from 'antd/lib/config-provider';
import { getTransitionName } from 'antd/lib/_util/motion';
import * as React from 'react';
import RcImage from './image-internal';
import { GroupConsumerProps } from './image-internal/PreviewGroup';

export const icons = {
  copyImage: (
    <Tooltip title="Copy Image" style={{ zIndex: 2000 }}>
      <CopyOutlined />
    </Tooltip>
  ),
  saveImage: (
    <Tooltip title="Save Image" style={{ zIndex: 2000 }}>
      <SaveOutlined />
    </Tooltip>
  ),
  zoomIn: (
    <Tooltip title="Zoom In" style={{ zIndex: 2000 }}>
      <ZoomInOutlined />
    </Tooltip>
  ),
  zoomOut: (
    <Tooltip title="Zoom Out" style={{ zIndex: 2000 }}>
      <ZoomOutOutlined />
    </Tooltip>
  ),
  close: (
    <Tooltip title="Close" style={{ zIndex: 2000 }}>
      {' '}
      <CloseOutlined />
    </Tooltip>
  ),
  left: <LeftOutlined />,
  right: <RightOutlined />,
};

const InternalPreviewGroup: React.FC<GroupConsumerProps> = ({
  previewPrefixCls: customizePrefixCls,
  preview,
  ...props
}: GroupConsumerProps) => {
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('image-preview', customizePrefixCls);
  const rootPrefixCls = getPrefixCls();

  const mergedPreview = React.useMemo(() => {
    if (preview === false) {
      return preview;
    }
    // eslint-disable-next-line
    const _preview = typeof preview === 'object' ? preview : {};

    return {
      ..._preview,
      transitionName: getTransitionName(
        rootPrefixCls,
        'zoom',
        _preview.transitionName
      ),
      maskTransitionName: getTransitionName(
        rootPrefixCls,
        'fade',
        _preview.maskTransitionName
      ),
    };
  }, [preview]);

  return (
    <RcImage.PreviewGroup
      preview={mergedPreview}
      previewPrefixCls={prefixCls}
      icons={icons}
      {...props}
    />
  );
};

export default InternalPreviewGroup;
