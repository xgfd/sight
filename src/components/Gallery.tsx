import { ClockCircleOutlined } from '@ant-design/icons';
import { Badge, Image, Space } from 'antd';
import path from 'path';
import React from 'react';
import fallback from '../../assets/fallback.png';
import { IMAGE_CACHE } from '../constants';
import Operation from '../Operation';

interface IProps {
  operations: Operation[];
  selectedKey: string;
}

export default function Gallery(props: IProps) {
  const { operations, selectedKey } = props;
  const imageComponents = operations.map((op) => {
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
      <Badge key={op.id} dot count={badgeCount}>
        <Image
          key={op.resultImageHash}
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
