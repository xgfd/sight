import {
  DeleteOutlined,
  PlusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  Button,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  Popconfirm,
  Space,
  Spin,
  Typography,
} from 'antd';
import { ipcRenderer, remote } from 'electron';
import fs from 'fs';
import React, { Component } from 'react';
import Operation from '../Operation';
import { exportScript, listScripts, rmScript, upsert } from '../utils';
import getIcon from './Icons';

const { Text } = Typography;
const { dialog } = remote;

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

interface IStates {
  installedScripts: { builtin: string[]; custom: string[] };
  drawerOn: boolean;
  insertionIndex: number;
  formValid: boolean;
}

/**
 * Group strings by their upper case first letter.
 * @param names
 */
function groupByFirstChar(names: string[]) {
  return names.reduce((group, name) => {
    const firstChar = name[0].toUpperCase();
    const charGroup = group[firstChar] || [];
    charGroup.push(name);
    group[firstChar] = charGroup;
    return group;
  }, {} as { [key: string]: string[] });
}

class OpList extends Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      installedScripts: listScripts(),
      drawerOn: false,
      insertionIndex: 0,
      formValid: false,
    };
  }

  componentDidMount() {
    ipcRenderer.on('OPEN', async () => {
      await this.openOpList();
    });

    ipcRenderer.on('SAVE', async () => {
      await this.saveOpList();
    });

    ipcRenderer.on('EXPORT_PYTHON', () => {
      this.exportAsPython();
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('OPEN');
    ipcRenderer.removeAllListeners('SAVE');
    ipcRenderer.removeAllListeners('EXPORT_PYTHON');
  }

  openOpList = async () => {
    const options = {
      filters: [{ name: 'json', extensions: ['json'] }],
    };
    const { canceled, filePaths } = await dialog.showOpenDialog(options);

    if (!canceled) {
      const filepath = filePaths[0];
      const response = await fetch(filepath);
      const opListJson: [{ fn: string; args: [] }] = await response.json();
      const operations = opListJson.map(Operation.fromJson);
      const { setOperations } = this.props;
      setOperations(operations);
    }
  };

  saveOpList = async () => {
    const { operations } = this.props;
    const instructions = operations.map((op) => {
      const opJson = op.toJson() as any;
      delete opJson.rid;
      return opJson;
    });

    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: 'operations.json',
      properties: ['createDirectory'],
    });

    if (!canceled) {
      fs.writeFileSync(
        filePath as string,
        JSON.stringify(instructions, null, 2)
      );
    }
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
        }
      });
    } else {
      newOp = new Operation(name, pack as 'custom' | 'builtin');
      insertOp(newOp, index);
    }
  };

  removeScript = (rmop: Operation) => {
    const { operations, setOperations, evalSequence } = this.props;

    rmScript(rmop.package, rmop.name);
    const firstOccurrence = operations.findIndex(
      (o) => o.package === rmop.package && o.name === rmop.name
    );
    const reducedOperations = operations.filter(
      (o) => o.package !== rmop.package || o.name !== rmop.name
    );
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

  toggleDrawer = () => this.setState({ drawerOn: false });

  render() {
    const {
      operations,
      selectedKey,
      resultUpToDate,
      selectOp,
      removeOp,
    } = this.props;

    const { installedScripts, drawerOn, formValid } = this.state;

    const builtinItemGroup = Object.entries(
      groupByFirstChar(installedScripts.builtin)
    ).map(([char, names]) => (
      <Menu.ItemGroup key={char} title={char}>
        {names.map((m_name) => (
          <Menu.Item key={`builtin.${m_name}`}>{m_name}</Menu.Item>
        ))}
      </Menu.ItemGroup>
    ));

    // drawer component to create a new custom function
    const newOpDrawer = (
      <Drawer
        title="Create a new custom function"
        width={300}
        onClose={this.toggleDrawer}
        visible={drawerOn}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          name="new"
          onFinish={(values) => {
            const { insertionIndex } = this.state;
            this.insertOp(`custom.__${values.name}` as string, insertionIndex);
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              () => ({
                validator: (_, value: string) => {
                  const pattern = /^[A-Za-z_]\w+$/;

                  if (!pattern.test(value)) {
                    this.setState({ formValid: false });
                    return Promise.reject(
                      new Error('Invalid Python module name!')
                    );
                  }

                  if (installedScripts.builtin.indexOf(value) !== -1) {
                    this.setState({ formValid: false });
                    return Promise.reject(
                      new Error('Same name as a builtin function!')
                    );
                  }

                  if (installedScripts.custom.indexOf(value) !== -1) {
                    this.setState({ formValid: false });
                    return Promise.reject(
                      new Error('Same name as a custom function!')
                    );
                  }

                  this.setState({ formValid: true });
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="A valid Python name" />
          </Form.Item>
          <Form.Item>
            <Button
              onClick={this.toggleDrawer}
              disabled={!formValid}
              htmlType="submit"
              type="primary"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    );

    // dropdown menu for the "+" button
    const dropdownMenu = (index: number) => (
      <Menu
        onClick={(info) => {
          info.domEvent.stopPropagation();
          if (info.key === 'new') {
            this.setState({ drawerOn: true, insertionIndex: index });
          } else {
            this.insertOp(info.key as string, index);
          }
        }}
      >
        <Menu.Item key="new">
          <PlusCircleOutlined />
          <Text strong>New</Text>
        </Menu.Item>
        {builtinItemGroup}
        <Menu.ItemGroup key="1" title="Custom">
          {installedScripts.custom.map((m_name) => (
            <Menu.Item key={`custom.${m_name}`}>{m_name}</Menu.Item>
          ))}
        </Menu.ItemGroup>
      </Menu>
    );

    // operations
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
            title={
              <>
                Script not executed. Use the Refresh <SyncOutlined /> button to
                execute.
              </>
            }
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
                  overlayStyle={{
                    width: 256,
                    maxHeight: '100vh',
                    overflowY: 'auto',
                  }}
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
                        Permanently delete &quot;{op.name}&quot;?
                        <br />
                        All occurrences on the list will be removed too.
                      </Text>
                    }
                    onConfirm={(e) => {
                      // important! otherwise will trigger Item's selection
                      e?.stopPropagation();
                      this.removeScript(op);
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
      <>
        <Menu
          mode="inline"
          style={{ minHeight: '100%' }}
          selectedKeys={[selectedKey]}
        >
          {opItems}
        </Menu>
        {newOpDrawer}
      </>
    );
  }
}

export default OpList;
