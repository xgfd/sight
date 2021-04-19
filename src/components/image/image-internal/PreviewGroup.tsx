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
/* eslint react/prop-types: "off" */
import * as React from 'react';
import { useState } from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { ImagePreviewType } from './Image';
import Preview, { PreviewProps } from './Preview';

export interface PreviewGroupPreview
  extends Omit<ImagePreviewType, 'icons' | 'mask' | 'maskClassName'> {
  /**
   * If Preview the show img index
   * @default 0
   */
  current?: number;
}

export interface GroupConsumerProps {
  previewPrefixCls?: string;
  icons?: PreviewProps['icons'];
  preview?: boolean | PreviewGroupPreview;
}

interface PreviewUrl {
  url: string;
  canPreview: boolean;
}

export interface GroupConsumerValue extends GroupConsumerProps {
  isPreviewGroup?: boolean;
  previewUrls: Map<number, string>;
  setPreviewUrls: React.Dispatch<React.SetStateAction<Map<number, PreviewUrl>>>;
  current: number | undefined;
  setCurrent: React.Dispatch<React.SetStateAction<number | undefined>>;
  setShowPreview:
    | React.Dispatch<React.SetStateAction<boolean | undefined>>
    | ((value: boolean) => void);
  setMousePosition: React.Dispatch<
    React.SetStateAction<null | { x: number; y: number }>
  >;
  registerImage: (id: number, url: string, canPreview?: boolean) => () => void;
}

export const context = React.createContext<GroupConsumerValue>({
  previewUrls: new Map(),
  setPreviewUrls: () => null,
  current: -1,
  setCurrent: () => null,
  setShowPreview: () => null,
  setMousePosition: () => null,
  registerImage: () => () => null,
});

const { Provider } = context;

const Group: React.FC<GroupConsumerProps> = ({
  previewPrefixCls = 'rc-image-preview',
  children,
  icons = {},
  preview,
}) => {
  const {
    visible: previewVisible = undefined,
    onVisibleChange: onPreviewVisibleChange = undefined,
    getContainer = undefined,
    current: currentIndex = 0,
    ...dialogProps
  } = typeof preview === 'object' ? preview : {};
  const [previewUrls, setPreviewUrls] = useState<Map<number, PreviewUrl>>(
    new Map()
  );
  const [current, setCurrent] = useState<number>();
  const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible, {
    value: previewVisible,
    onChange: onPreviewVisibleChange,
  });
  const [mousePosition, setMousePosition] = useState<null | {
    x: number;
    y: number;
  }>(null);
  const isControlled = previewVisible !== undefined;
  const previewUrlsKeys = Array.from(previewUrls.keys());
  const currentControlledKey = previewUrlsKeys[currentIndex];
  const canPreviewUrls = new Map<number, string>(
    Array.from(previewUrls)
      .filter(([, { canPreview }]) => !!canPreview)
      .map(([id, { url }]) => [id, url])
  );

  const registerImage = (id: number, url: string, canPreview = true) => {
    const unRegister = () => {
      setPreviewUrls((oldPreviewUrls) => {
        const clonePreviewUrls = new Map(oldPreviewUrls);
        const deleteResult = clonePreviewUrls.delete(id);
        return deleteResult ? clonePreviewUrls : oldPreviewUrls;
      });
    };

    setPreviewUrls((oldPreviewUrls) => {
      return new Map(oldPreviewUrls).set(id, {
        url,
        canPreview,
      });
    });

    return unRegister;
  };

  const onPreviewClose = (e: React.SyntheticEvent<Element>) => {
    e.stopPropagation();
    setShowPreview(false);
    setMousePosition(null);
  };

  React.useEffect(() => {
    setCurrent(currentControlledKey);
  }, [currentControlledKey]);

  React.useEffect(() => {
    if (!isShowPreview && isControlled) {
      setCurrent(currentControlledKey);
    }
  }, [currentControlledKey, isControlled, isShowPreview]);

  return (
    <Provider
      value={{
        isPreviewGroup: true,
        previewUrls: canPreviewUrls,
        setPreviewUrls,
        current,
        setCurrent,
        setShowPreview,
        setMousePosition,
        registerImage,
      }}
    >
      {children}
      <Preview
        aria-hidden={!isShowPreview}
        visible={isShowPreview}
        prefixCls={previewPrefixCls}
        onClose={onPreviewClose}
        mousePosition={mousePosition as any}
        src={canPreviewUrls.get(current as number)}
        icons={icons}
        getContainer={getContainer}
        {...dialogProps}
      />
    </Provider>
  );
};

export default Group;
