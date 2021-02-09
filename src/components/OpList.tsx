import {
  BlockOutlined,
  BuildOutlined,
  ControlOutlined,
  DeleteOutlined,
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
  Popconfirm,
  Space,
  Spin,
  Typography,
} from 'antd';
import React, { Component } from 'react';
import Operation from '../Operation';
import { listScripts, upsert, rmScript } from '../utils';

const customScripts = listScripts().custom.sort();
// custom script name suffix
// incremented every time a new script is added
let customNameCounter =
  customScripts.length > 0
    ? parseInt(
        customScripts[customScripts.length - 1].replace('custom', ''),
        10
      ) + 1
    : 1;

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
  resultUpToDate: boolean;
  setOperations: (operations: Operation[]) => void;
  selectOp: (op: Operation, index: number) => void;
  insertOp: (op: Operation, index: number) => void;
  removeOp: (index: number) => void;
  evalSequence: (index?: number) => void;
}

// this is a temporary hack
function uniqueCustomName(existingNames: string[]) {
  // let name;
  // for (let i = 1; ; i++) {
  //   name = `custom${i}`;
  //   if (existingNames.indexOf(name) === -1) {
  //     return name;
  //   }
  // }
  const name = `custom${customNameCounter}`;
  return name;
}

class OpList extends Component<
  IProps,
  { installedScripts: { builtin: string[]; custom: string[] } }
> {
  constructor(props: IProps) {
    super(props);
    this.state = { installedScripts: listScripts() };
  }

  insertOp = (fullOpName: string, index: number) => {
    const { insertOp } = this.props;
    const [pack, name] = fullOpName.split('.');
    let newOp: Operation;
    if (name.startsWith('__')) {
      const trimmedName = name.substring(2);
      newOp = new Operation(trimmedName, 'custom', true);
      upsert('custom', trimmedName, (err) => {
        if (!err) {
          insertOp(newOp, index);
          this.setState({ installedScripts: listScripts() });

          customNameCounter += 1;
        }
      });
    } else {
      newOp = new Operation(name, pack as 'custom' | 'builtin');
      insertOp(newOp, index);
    }
  };

  render() {
    const {
      operations,
      selectedKey,
      resultUpToDate,
      setOperations,
      selectOp,
      removeOp,
      evalSequence,
    } = this.props;

    const { installedScripts } = this.state;

    const dropdownMenu = (index: number) => (
      <Menu
        onClick={(info) => {
          info.domEvent.stopPropagation();
          this.insertOp(info.key as string, index);
        }}
        style={{ width: 256 }}
      >
        <Menu.Item
          key={`custom.__${uniqueCustomName(installedScripts.custom)}`}
        >
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

    const removeScript = (op: Operation) => {
      rmScript(op.package, op.name);
      const firstOccurrence = operations.findIndex((o) => o.name === op.name);
      const reducedOperations = operations.filter((o) => o.name !== op.name);
      setOperations(reducedOperations);
      this.setState({
        installedScripts: listScripts(),
      });

      // the first occurrence is at the bottom
      if (firstOccurrence >= reducedOperations.length) {
        const selectionIndex = reducedOperations.length - 1;
        selectOp(reducedOperations[selectionIndex], selectionIndex);
      } else {
        evalSequence(firstOccurrence);
        selectOp(reducedOperations[firstOccurrence], firstOccurrence);
      }
    };

    const opItems = operations.map((op, index) => {
      // Menu.Item.onClick and Popconfirm are mutually exclusive
      // only show Popconfirm when moving away from a unsaved op.
      const popconfirmDisabled = resultUpToDate || selectedKey === op.id;

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
            title="Script not executed. Use the Run button to execute?"
            disabled={popconfirmDisabled}
          >
            <Space size="small">
              <Text ellipsis={{ tooltip: op.name }} style={{ width: 60 }}>
                {op.name}
              </Text>
              <div style={{ textAlign: 'center' }}>
                <Dropdown
                  disabled={!op.resultImageHash}
                  overlay={dropdownMenu(index)}
                >
                  <Button type="text" size="small">
                    +
                  </Button>
                </Dropdown>
                <Button
                  type="text"
                  size="small"
                  danger
                  disabled={index === 0}
                  onClick={() => {
                    removeOp(index);
                  }}
                >
                  -
                </Button>
                {op.package === 'custom' && (
                  <Popconfirm
                    title="Going to remove the script from disk and all its occurrences from the operation list. Are you sure?"
                    onConfirm={(e) => {
                      // important! otherwise will trigger Item's selection
                      e?.stopPropagation();
                      removeScript(op);
                    }}
                  >
                    <Button type="text" size="small" danger>
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                )}
                {op.loading && <Spin size="small" />}
              </div>
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
