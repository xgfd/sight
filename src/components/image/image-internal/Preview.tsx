import classnames from 'classnames';
import Dialog, { DialogProps as IDialogPropTypes } from 'rc-dialog';
import * as React from 'react';
import { context } from './PreviewGroup';
import ZoomViewer, { ProvidedZoom } from './ZoomViewer';

export interface PreviewProps extends Omit<IDialogPropTypes, 'onClose'> {
  onClose?: (e: React.SyntheticEvent<Element>) => void;
  src?: string;
  alt?: string;
  icons?: {
    rotateLeft?: React.ReactNode;
    rotateRight?: React.ReactNode;
    zoomIn?: React.ReactNode;
    zoomOut?: React.ReactNode;
    close?: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
  };
}

let zoom: ProvidedZoom | undefined;

const Preview: React.FC<PreviewProps> = (props) => {
  const {
    prefixCls,
    src,
    alt,
    onClose,
    afterClose,
    visible,
    icons = {},
    ...restProps
  } = props;
  const { zoomIn, zoomOut, close, left, right } = icons;
  const { previewUrls, current, isPreviewGroup, setCurrent } = React.useContext(
    context
  );
  const previewGroupCount = previewUrls.size;
  const previewUrlsKeys = Array.from(previewUrls.keys());
  const currentPreviewIndex = previewUrlsKeys.indexOf(current);
  const combinationSrc = isPreviewGroup ? previewUrls.get(current) : src;
  const showLeftOrRightSwitches = isPreviewGroup && previewGroupCount > 1;

  const onAfterClose = () => {
    if (zoom !== undefined) {
      zoom.reset();
    }
  };

  const onZoomIn = () => {
    if (zoom !== undefined) {
      zoom.scale({ scaleX: 1.2, scaleY: 1.2 });
    }
  };

  const onZoomOut = () => {
    if (zoom !== undefined) {
      zoom.scale({ scaleX: 0.8, scaleY: 0.8 });
    }
  };

  const onSwitchLeft: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    // Without this mask close will abnormal
    event.stopPropagation();
    if (currentPreviewIndex > 0) {
      setCurrent(previewUrlsKeys[currentPreviewIndex - 1]);
    }
  };

  const onSwitchRight: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    // Without this mask close will abnormal
    event.stopPropagation();
    if (currentPreviewIndex < previewGroupCount - 1) {
      setCurrent(previewUrlsKeys[currentPreviewIndex + 1]);
    }
  };

  const toolClassName = `${prefixCls}-operations-operation`;
  const iconClassName = `${prefixCls}-operations-icon`;
  const tools = [
    {
      icon: close,
      onClick: onClose,
      type: 'close',
    },
    {
      icon: zoomIn,
      onClick: onZoomIn,
      type: 'zoomIn',
    },
    {
      icon: zoomOut,
      onClick: onZoomOut,
      type: 'zoomOut',
    },
  ];

  return (
    <Dialog
      transitionName="zoom"
      maskTransitionName="fade"
      closable={false}
      keyboard
      prefixCls={prefixCls}
      onClose={onClose}
      afterClose={onAfterClose}
      visible={visible}
      // wrapClassName={wrapClassName}
      {...restProps}
    >
      <ul className={`${prefixCls}-operations`}>
        {tools.map(({ icon, onClick, type }) => (
          <li
            className={classnames(toolClassName, {
              [`${prefixCls}-operations-operation-disabled`]: false,
            })}
            onClick={onClick}
            key={type}
          >
            {React.isValidElement(icon)
              ? React.cloneElement(icon, { className: iconClassName })
              : icon}
          </li>
        ))}
      </ul>
      <ZoomViewer
        className={`${prefixCls}-zoom`}
        imgRef={combinationSrc}
        exposeZoom={(z) => {
          zoom = z;
        }}
      />
      {showLeftOrRightSwitches && (
        <div
          className={classnames(`${prefixCls}-switch-left`, {
            [`${prefixCls}-switch-left-disabled`]: currentPreviewIndex === 0,
          })}
          onClick={onSwitchLeft}
        >
          {left}
        </div>
      )}
      {showLeftOrRightSwitches && (
        <div
          className={classnames(`${prefixCls}-switch-right`, {
            [`${prefixCls}-switch-right-disabled`]:
              currentPreviewIndex === previewGroupCount - 1,
          })}
          onClick={onSwitchRight}
        >
          {right}
        </div>
      )}
    </Dialog>
  );
};

export default Preview;
