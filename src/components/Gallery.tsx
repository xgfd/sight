import { ClockCircleOutlined } from '@ant-design/icons';
import { Badge, Image, Space } from 'antd';
import path from 'path';
import React from 'react';
import fallback from '../../assets/fallback.png';
import { IMAGE_CACHE } from '../constants';
import Operation from '../Operation';

interface IProps {
  operations: Operation[];
  selectedOp: Operation;
}

export default function Gallery(props: IProps) {
  const { operations, selectedOp } = props;
  const selectedKey = selectedOp.id;
  const imageComponents = operations.map((op, index) => {
    let badgeCount;
    if (op.id === selectedKey) {
      badgeCount = op.loading ? (
        <ClockCircleOutlined style={{ color: '#f5222d' }} />
      ) : (
        1
      );
    } else {
      badgeCount = 0;
    }
    return (
      // somehow providing `key` to each Image casuses preview images are ordered by the order that the images are updated, not by the order of the thumbnails
      // eslint-disable-next-line react/no-array-index-key
      <Badge key={index} dot count={badgeCount}>
        <Image
          height={200}
          width={200}
          src={
            op.resultImageHash
              ? path.join(IMAGE_CACHE, `${op.resultImageHash}.png`) // currently image format is hardcoded to png
              : ''
          }
          fallback={fallback}
        />
      </Badge>
    );
  });
  return (
    <Image.PreviewGroup>
      <Space>{imageComponents}</Space>
    </Image.PreviewGroup>
  );
}
