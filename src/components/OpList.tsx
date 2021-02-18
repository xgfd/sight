import {
  DeleteOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
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
import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import Operation from '../Operation';
import { exportScript, listScripts, rmScript, upsert } from '../utils';
import getIcon from './Icons';

const customScripts = listScripts()
  .custom.filter((n) => n.includes('custom'))
  .sort();
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

interface IProps {
  operations: Operation[];
  selectedKey: string;
  resultUpToDate: boolean;
  setOperations: (operations: Operation[], selectionIndex?: number) => void;
  selectOp: (op: Operation, index: number) => void;
  insertOp: (op: Operation, index: number) => void;
  removeOp: (index: number) => void;
  evalSequence: (index?: number) => void;
}

// this is a temporary hack
function uniqueCustomName() {
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

  componentDidMount() {
    ipcRenderer.on('OPEN', () => {
      this.openOpList();
    });

    ipcRenderer.on('SAVE', () => {
      this.saveOpList();
    });

    ipcRenderer.on('EXPORT_PYTHON', () => {
      this.exportAsPython();
    });
  }

  openOpList = () => {
    const element = document.createElement('input');
    element.type = 'file';
    element.accept = 'application/json';
    element.addEventListener('input', async () => {
      const filepath = (element as any).files[0];
      const response = await fetch(filepath.path);
      const opListJson: [{ fn: string; args: [] }] = await response.json();
      const operations = opListJson.map(Operation.fromJson);
      const { setOperations } = this.props;
      setOperations(operations);
    });
    element.click();
  };

  saveOpList = () => {
    const { operations } = this.props;
    const instructions = operations.map((op) => {
      const opJson = op.toJson() as any;
      delete opJson.rid;
      return opJson;
    });
    const file = new Blob([JSON.stringify(instructions, null, 2)], {
      type: 'application/json',
    });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = 'operations.json';
    element.click();
  };

  exportAsPython = () => {
    const { operations } = this.props;
    exportScript(operations, async (filepath) => {
      const response = await fetch(filepath);
      const content = await response.blob();
      const file = new Blob([content], { type: 'application/zip' });
      const element = document.createElement('a');
      element.href = URL.createObjectURL(file);
      element.download = 'archive.zip';
      element.click();
    });
  };

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
        <Menu.Item key={`custom.__${uniqueCustomName()}`}>
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
      this.setState({
        installedScripts: listScripts(),
      });

      // the first occurrence is at the bottom
      if (firstOccurrence >= reducedOperations.length) {
        const selectionIndex = reducedOperations.length - 1;
        setOperations(reducedOperations, selectionIndex);
      } else {
        setOperations(reducedOperations, firstOccurrence);
        evalSequence(firstOccurrence);
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
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOp(index);
                  }}
                >
                  -
                </Button>
                {op.package === 'custom' && (
                  <Popconfirm
                    title={
                      <Text>
                        Permanently delete {op.name}?
                        <br />
                        All occurrences on the list will be removed too.
                      </Text>
                    }
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
