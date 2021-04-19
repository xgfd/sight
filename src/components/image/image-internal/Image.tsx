// MIT LICENSE

// Copyright (c) 2015-present Alipay.com, https://www.alipay.com/

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/* eslint react/jsx-props-no-spreading: "off" */
/* eslint import/no-cycle: "off" */
/* eslint jsx-a11y/click-events-have-key-events: "off" */
import cn from 'classnames';
import { IDialogPropTypes } from 'rc-dialog/lib/IDialogPropTypes';
import { getOffset } from 'rc-util/lib/Dom/css';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { GetContainer } from 'rc-util/lib/PortalWrapper';
import * as React from 'react';
import { useState } from 'react';
import Preview, { PreviewProps } from './Preview';
import PreviewGroup, { context } from './PreviewGroup';

export interface ImagePreviewType
  extends Omit<
    IDialogPropTypes,
    | 'mask'
    | 'visible'
    | 'closable'
    | 'prefixCls'
    | 'onClose'
    | 'afterClose'
    | 'wrapClassName'
  > {
  src?: string;
  visible?: boolean;
  onVisibleChange?: (value: boolean, prevValue: boolean) => void;
  getContainer?: GetContainer | false;
  mask?: React.ReactNode;
  maskClassName?: string;
  icons?: PreviewProps['icons'];
}

let uuid = 0;

export interface ImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'placeholder' | 'onClick'
  > {
  // Original
  src?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  prefixCls?: string;
  previewPrefixCls?: string;
  placeholder?: React.ReactNode;
  fallback?: string;
  preview?: boolean | ImagePreviewType;
  /**
   * @deprecated since version 3.2.1
   */
  onPreviewClose?: (value: boolean, prevValue: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

interface CompoundedComponent<P> extends React.FC<P> {
  PreviewGroup: typeof PreviewGroup;
}

type ImageStatus = 'normal' | 'error' | 'loading';

const ImageInternal: CompoundedComponent<ImageProps> = ({
  src: imgSrc,
  alt,
  onPreviewClose: onInitialPreviewClose,
  prefixCls = 'rc-image',
  previewPrefixCls = `${prefixCls}-preview`,
  placeholder,
  fallback,
  width,
  height,
  style,
  preview = true,
  className,
  onClick,
  onError: onImageError,
  wrapperClassName,
  wrapperStyle,

  // Img
  crossOrigin,
  decoding,
  loading,
  referrerPolicy,
  sizes,
  srcSet,
  useMap,
  ...otherProps
}: ImageProps) => {
  const isCustomPlaceholder = placeholder && placeholder !== true;
  const {
    src: previewSrc,
    visible: previewVisible = undefined,
    onVisibleChange: onPreviewVisibleChange = onInitialPreviewClose,
    getContainer: getPreviewContainer = undefined,
    mask: previewMask,
    maskClassName,
    icons,
    ...dialogProps
  }: ImagePreviewType = typeof preview === 'object' ? preview : {};
  const src = previewSrc ?? imgSrc;
  const isControlled = previewVisible !== undefined;
  const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible, {
    value: previewVisible,
    onChange: onPreviewVisibleChange,
  });
  const [status, setStatus] = useState<ImageStatus>(
    isCustomPlaceholder ? 'loading' : 'normal'
  );
  const [mousePosition, setMousePosition] = useState<null | {
    x: number;
    y: number;
  }>(null);
  const isError = status === 'error';
  const {
    isPreviewGroup,
    setCurrent,
    setShowPreview: setGroupShowPreview,
    setMousePosition: setGroupMousePosition,
    registerImage,
  } = React.useContext(context);
  const [currentId] = React.useState<number>(() => {
    uuid += 1;
    return uuid;
  });
  const canPreview = preview && !isError;

  const isLoaded = React.useRef(false);

  const onLoad = () => {
    setStatus('normal');
  };

  const onError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (onImageError) {
      onImageError(e);
    }
    setStatus('error');
  };

  const onPreview: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isControlled) {
      const { left, top } = getOffset(e.target);

      if (isPreviewGroup) {
        setCurrent(currentId);
        setGroupMousePosition({
          x: left,
          y: top,
        });
      } else {
        setMousePosition({
          x: left,
          y: top,
        });
      }
    }

    if (isPreviewGroup) {
      setGroupShowPreview(true);
    } else {
      setShowPreview(true);
    }

    if (onClick) onClick(e);
  };

  const onPreviewClose = (e: React.SyntheticEvent<Element>) => {
    e.stopPropagation();
    setShowPreview(false);
    if (!isControlled) {
      setMousePosition(null);
    }
  };

  const getImgRef = (img?: HTMLImageElement) => {
    isLoaded.current = false;
    if (status !== 'loading') return;
    if (img?.complete && (img.naturalWidth || img.naturalHeight)) {
      isLoaded.current = true;
      onLoad();
    }
  };

  // Keep order start
  // Resolve https://github.com/ant-design/ant-design/issues/28881
  // Only need unRegister when component unMount
  React.useEffect(() => {
    const unRegister = registerImage(currentId, src as string);

    return unRegister;
  }, []);

  React.useEffect(() => {
    registerImage(currentId, src as string, canPreview);
  }, [src, canPreview]);
  // Keep order end

  React.useEffect(() => {
    if (isError) {
      setStatus('normal');
    }
    if (isCustomPlaceholder && !isLoaded.current) {
      setStatus('loading');
    }
  }, [imgSrc]);

  const wrapperClass = cn(prefixCls, wrapperClassName, {
    [`${prefixCls}-error`]: isError,
  });

  const mergedSrc = isError && fallback ? fallback : src;
  const imgCommonProps = {
    crossOrigin,
    decoding,
    loading,
    referrerPolicy,
    sizes,
    srcSet,
    useMap,
    alt,
    className: cn(
      `${prefixCls}-img`,
      {
        [`${prefixCls}-img-placeholder`]: placeholder === true,
      },
      className
    ),
    style: {
      height,
      ...style,
    },
  };

  return (
    <>
      <div
        role="button"
        tabIndex={-1}
        {...otherProps}
        className={wrapperClass}
        onClick={preview && !isError ? onPreview : onClick}
        style={{
          width,
          height,
          ...wrapperStyle,
        }}
      >
        <img
          alt=""
          {...imgCommonProps}
          ref={getImgRef as any}
          {...(isError && fallback
            ? {
                src: fallback,
              }
            : { onLoad, onError, src: imgSrc })}
        />

        {status === 'loading' && (
          <div aria-hidden="true" className={`${prefixCls}-placeholder`}>
            {placeholder}
          </div>
        )}

        {/* Preview Click Mask */}
        {previewMask && canPreview && (
          <div className={cn(`${prefixCls}-mask`, maskClassName)}>
            {previewMask}
          </div>
        )}
      </div>
      {!isPreviewGroup && canPreview && (
        <Preview
          aria-hidden={!isShowPreview}
          visible={isShowPreview}
          prefixCls={previewPrefixCls}
          onClose={onPreviewClose}
          mousePosition={mousePosition as any}
          src={mergedSrc}
          alt={alt}
          getContainer={getPreviewContainer}
          icons={icons}
          {...dialogProps}
        />
      )}
    </>
  );
};

ImageInternal.PreviewGroup = PreviewGroup;

ImageInternal.displayName = 'Image';

export default ImageInternal;
