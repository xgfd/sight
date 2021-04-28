/* eslint react/jsx-props-no-spreading: "off" */
/* eslint import/no-cycle: "off" */
/* eslint jsx-a11y/click-events-have-key-events: "off" */
import { message } from 'antd';
import classnames from 'classnames';
import { clipboard, remote } from 'electron';
import fs from 'fs';
import path from 'path';
import Dialog, { DialogProps as IDialogPropTypes } from 'rc-dialog';
import * as React from 'react';
import { context } from './PreviewGroup';
import ZoomViewer, { ProvidedZoom } from './ZoomViewer';

const { dialog } = remote;

export interface PreviewProps extends Omit<IDialogPropTypes, 'onClose'> {
  onClose?: (e: React.SyntheticEvent<Element>) => void;
  src?: string;
  alt?: string;
  icons?: {
    saveImage?: React.ReactNode;
    copyImage?: React.ReactNode;
    rotateLeft?: React.ReactNode;
    rotateRight?: React.ReactNode;
    zoomIn?: React.ReactNode;
    resetZoom?: React.ReactNode;
    zoomOut?: React.ReactNode;
    close?: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
  };
}

let zoom: ProvidedZoom | undefined;

const Preview: React.FC<PreviewProps> = (props: PreviewProps) => {
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
  const {
    saveImage,
    copyImage,
    zoomIn,
    resetZoom,
    zoomOut,
    close,
    left,
    right,
  } = icons;
  const { previewUrls, current, isPreviewGroup, setCurrent } = React.useContext(
    context
  );
  const previewGroupCount = previewUrls.size;
  const previewUrlsKeys = Array.from(previewUrls.keys());
  const currentPreviewIndex = previewUrlsKeys.indexOf(current as number);
  const combinationSrc = isPreviewGroup
    ? previewUrls.get(current as number)
    : src;
  const showLeftOrRightSwitches = isPreviewGroup && previewGroupCount > 1;

  const onSaveImage = async () => {
    if (combinationSrc !== undefined) {
      const { canceled, filePath } = await dialog.showSaveDialog({
        defaultPath: `image${path.extname(combinationSrc as string)}`,
        properties: ['createDirectory'],
      });

      if (!canceled) {
        fs.copyFileSync(combinationSrc, filePath as string);
      }
    }
  };

  const onCopyImage = async () => {
    try {
      if (combinationSrc !== undefined) {
        clipboard.writeImage(combinationSrc as any);
        message.info({
          content: 'Image copied',
        });
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  };

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

  const onResetZoom = () => {
    if (zoom !== undefined) {
      zoom.reset();
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
      icon: resetZoom,
      onClick: onResetZoom,
      type: 'resetZoom',
    },
    {
      icon: zoomOut,
      onClick: onZoomOut,
      type: 'zoomOut',
    },
    {
      icon: copyImage,
      onClick: onCopyImage,
      type: 'copyImage',
    },
    {
      icon: saveImage,
      onClick: onSaveImage,
      type: 'saveImage',
    },
  ];

  return (
    <Dialog
      zIndex={1009}
      transitionName="zoom"
      maskTransitionName="fade"
      closable={false}
      keyboard
      prefixCls={prefixCls}
      onClose={onClose}
      afterClose={onAfterClose}
      visible={visible}
      {...restProps}
    >
      <ul className={`${prefixCls}-operations`}>
        {tools.map(({ icon, onClick, type }) => (
          <li key={type}>
            <div
              role="button"
              tabIndex={-1}
              className={classnames(toolClassName, {
                [`${prefixCls}-operations-operation-disabled`]: false,
              })}
              onClick={onClick}
            >
              {React.isValidElement(icon)
                ? React.cloneElement(icon, { className: iconClassName })
                : icon}
            </div>
          </li>
        ))}
      </ul>
      <ZoomViewer
        className={`${prefixCls}-zoom`}
        imgSrc={combinationSrc as string}
        exposeZoom={(z) => {
          zoom = z;
        }}
      />
      {showLeftOrRightSwitches && (
        <div
          role="button"
          tabIndex={-1}
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
          role="button"
          tabIndex={-1}
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
