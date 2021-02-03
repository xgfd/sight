import {
  BlockOutlined,
  BuildOutlined,
  ControlOutlined,
  FolderOpenOutlined,
  HeatMapOutlined,
  HighlightOutlined,
  PlusCircleOutlined,
  SlidersOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Menu,
  Space,
  Spin,
  Popconfirm,
  Typography,
} from 'antd';
import React, { Component } from 'react';
import Operation from '../Operation';
import { listScripts } from '../utils';

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
  saved: boolean;
  selectOp: (op: Operation, index: number) => void;
  insertOp: (op: Operation, index: number) => void;
  removeOp: (index: number) => void;
}

class OpList extends Component<IProps, unknown> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  insertOp = (fullOpName: string, index: number) => {
    const { insertOp } = this.props;
    const [pack, name] = fullOpName.split('.');
    let newOp;
    // console.log('new op', name, pack);
    if (name.startsWith('__')) {
      const trimUnderscores = name.substring(2);
      newOp = new Operation(trimUnderscores, 'custom', true);
    } else {
      newOp = new Operation(name, pack as 'custom' | 'builtin');
    }
    insertOp(newOp, index);
  };

  render() {
    const { operations, selectedKey, saved, selectOp, removeOp } = this.props;

    const installedScripts = listScripts();

    const dropdownMenu = (index: number) => (
      <Menu
        onClick={(info) => {
          info.domEvent.stopPropagation();
          this.insertOp(info.key as string, index);
        }}
        style={{ width: 256 }}
      >
        <Menu.Item key={`custom.__custom${installedScripts.custom.length}`}>
          <PlusCircleOutlined />
          <Text strong>New</Text>
        </Menu.Item>
        <Menu.ItemGroup key="0" title="Builtins">
          {installedScripts.builtin.map((m_name) => (
            <Menu.Item key={`builtin.${m_name}`}>{m_name}</Menu.Item>
          ))}
        </Menu.ItemGroup>
        <Menu.ItemGroup key="1" title="Custom">
          {installedScripts.custom.map((m_name) => (
            <Menu.Item key={`custom.${m_name}`}>{m_name}</Menu.Item>
          ))}
        </Menu.ItemGroup>
      </Menu>
    );

    const opItems = operations.map((op, index) => {
      // Menu.Item.onClick and Popconfirm are mutually exclusive
      // only show Popconfirm when moving away from a unsaved op.
      const popconfirmDisabled = saved || selectedKey === op.id;
      return (
        <Menu.Item
          key={op.id}
          icon={getIcon(op)}
          onClick={(info) => {
            info.domEvent.stopPropagation();
            if (!popconfirmDisabled) {
              return;
            }
            selectOp(op, index);
          }}
        >
          <Popconfirm
            title="Script not saved. Are sure to switch?"
            disabled={popconfirmDisabled}
            onConfirm={() => {
              selectOp(op, index);
            }}
          >
            <Space size="middle">
              <Text ellipsis={{ tooltip: op.name }} style={{ width: 60 }}>
                {op.name}
              </Text>
              <div style={{ textAlign: 'center' }}>
                <Dropdown overlay={dropdownMenu(index)}>
                  <Button type="text" size="small">
                    +
                  </Button>
                </Dropdown>
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
          </Popconfirm>
        </Menu.Item>
      );
    });
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
