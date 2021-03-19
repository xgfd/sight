import { ClockCircleOutlined } from '@ant-design/icons';
import { Badge, Image, Space } from 'antd';
import path from 'path';
import React from 'react';
import fallback from '../../assets/fallback.png';
import { IMAGE_CACHE } from '../constants';
import OpItem from '../Operation';

interface IProps {
  operations: OpItem[];
  selectedOp: OpItem;
}

export default function Gallery(props: IProps) {
  const { operations, selectedOp } = props;
  const selectedKey = selectedOp.id;
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
    const imgPath = op.resultHash
      ? path.join(IMAGE_CACHE, `${op.resultHash}.png`)
      : '';
    return (
      <Badge key={op.id} dot count={badgeCount}>
        <Image height={200} width={200} src={imgPath} fallback={fallback} />
      </Badge>
    );
  });
  return (
    <Image.PreviewGroup key={selectedOp.resultHash}>
      <Space>{imageComponents}</Space>
    </Image.PreviewGroup>
  );
}
