/* eslint react/jsx-props-no-spreading: "off" */
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { ConfigContext } from 'antd/lib/config-provider';
import defaultLocale from 'antd/lib/locale/en_US';
import { getTransitionName } from 'antd/lib/_util/motion';
import * as React from 'react';
import { useContext } from 'react';
import RcImage from './image-internal';
import type { ImageProps } from './image-internal';
import PreviewGroup, { icons } from './PreviewGroup';

export interface CompositionImage<P> extends React.FC<P> {
  PreviewGroup: typeof PreviewGroup;
}

const Image: CompositionImage<ImageProps> = ({
  prefixCls: customizePrefixCls,
  preview,
  ...otherProps
}: ImageProps) => {
  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('image', customizePrefixCls);
  const rootPrefixCls = getPrefixCls();

  const { locale: contextLocale = defaultLocale } = useContext(ConfigContext);
  const imageLocale = contextLocale.Image;

  const mergedPreview = React.useMemo(() => {
    if (preview === false) {
      return preview;
    }
    // eslint-disable-next-line
    const _preview = typeof preview === 'object' ? preview : {};

    return {
      mask: (
        <div className={`${prefixCls}-mask-info`}>
          <EyeOutlined />
          {imageLocale?.preview}
        </div>
      ),
      icons,
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
  }, [preview, imageLocale]);

  return (
    <RcImage prefixCls={prefixCls} preview={mergedPreview} {...otherProps} />
  );
};

export type { ImageProps };

Image.PreviewGroup = PreviewGroup;

export default Image;
