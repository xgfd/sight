import {
  BlockOutlined,
  BuildOutlined,
  ControlOutlined,
  FolderOpenOutlined,
  HeatMapOutlined,
  HighlightOutlined,
  SlidersOutlined,
} from '@ant-design/icons';
import { Button, Menu, Space, Spin, Typography } from 'antd';
import React, { Component } from 'react';
import Operation from '../Operation';

const { Text } = Typography;

const iconMap: { [key: string]: React.ReactNode } = {
  imread: <FolderOpenOutlined />,
  canny: <ControlOutlined />,
  annotation: <HighlightOutlined />,
  contours: <HeatMapOutlined />,
  filter: <BuildOutlined />,
  bitwise_and: <BlockOutlined />,
  bitwise_or: <BlockOutlined />,
  bitwise_xor: <BlockOutlined />,
};

function getIcon(op: Operation): React.ReactNode {
  let icon;
  if (op.package === 'custom') {
    icon = <SlidersOutlined />;
  } else {
    // for builtin functions read from the icon map or use its first letter
    icon = iconMap[op.name] || <Text strong>{op.name[0].toUpperCase()}</Text>;
  }
  return icon;
}

interface IProps {
  operations: Operation[];
  selectedKey: string;
  selectOp: (op: Operation, index: number) => void;
  insertOp: (op: Operation, index: number) => void;
  removeOp: (index: number) => void;
}

class OpList extends Component<IProps, unknown> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      operations,
      selectOp,
      insertOp,
      removeOp,
      selectedKey,
    } = this.props;
    const opItems = operations.map((op, index) => (
      <Menu.Item
        key={op.id}
        icon={getIcon(op)}
        onClick={(item) => {
          const e = item.domEvent;
          e.stopPropagation();
          selectOp(op, index);
        }}
      >
        <Space size="middle">
          <Text>{op.name}</Text>
          <div style={{ textAlign: 'center' }}>
            <Button
              type="text"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                insertOp(new Operation('new op', 'custom', true), index);
              }}
            >
              +
            </Button>
            <Button
              type="text"
              size="small"
              danger
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                removeOp(index);
              }}
            >
              -
            </Button>
          </div>
          {op.loading && <Spin delay={200} size="small" />}
        </Space>
      </Menu.Item>
    ));
    return (
      <Menu
        mode="inline"
        style={{ minHeight: '100%' }}
        selectedKeys={[selectedKey]}
      >
        {opItems}
      </Menu>
    );
  }
}

export default OpList;
