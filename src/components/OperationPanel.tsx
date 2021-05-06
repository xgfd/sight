import {
  DeleteOutlined,
  PlusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { dialog } from '@electron/remote';
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
import { ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';
import React, { Component } from 'react';
import OpItem from '../Operation';
import { OpJSON } from '../type';
import { exportScript, listScripts, notify, rmScript, upsert } from '../utils';
import getIcon from './Icons';

const { Text } = Typography;

interface Props {
  operations: OpItem[];
  selectedKey: string;
  resultUpToDate: boolean;
  setOperations: (operations: OpItem[], selectionIndex?: number) => void;
  selectOp: (op: OpItem, index: number) => void;
  insertOp: (op: OpItem, index: number) => void;
  removeOp: (index: number) => void;
}

interface States {
  installedScripts: { builtin: string[]; custom: string[] };
  drawerOn: boolean;
  insertionIndex: number;
  formValid: boolean;
}

/**
 * Group strings by their upper case first letter.
 * @param builtinNames
 */
function groupByFirstChar(builtinNames: string[], customNames: string[]) {
  const builtinGroup = builtinNames.reduce((group, name) => {
    const firstChar = name[0].toUpperCase();
    const charGroup = group[firstChar] || [];
    charGroup.push(['builtin', name]);
    group[firstChar] = charGroup;
    return group;
  }, {} as { [key: string]: [string, string][] });

  return customNames.reduce((group, name) => {
    const firstChar = name[0].toUpperCase();
    const charGroup = group[firstChar] || [];
    charGroup.push(['custom', name]);
    group[firstChar] = charGroup;
    return group;
  }, builtinGroup);
}

class OperationPanel extends Component<Props, States> {
  constructor(props: Props) {
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
      properties: ['openFile' as const, 'openDirectory' as const],
      filters: [{ name: 'sightfile', extensions: ['json'] }],
    };
    const { canceled, filePaths } = await dialog.showOpenDialog(options);

    if (!canceled) {
      let sightfilePath = filePaths[0];
      if (fs.lstatSync(sightfilePath).isDirectory()) {
        sightfilePath = path.join(sightfilePath, 'Sightfile.json');
      }
      try {
        const response = await fetch(sightfilePath);

        const opListJson: OpJSON[] = await response.json();

        const operations = opListJson.map(OpItem.fromJson);

        const { setOperations, selectOp } = this.props;
        setOperations(operations);
        selectOp(operations[0], 0);
      } catch (e) {
        notify('warning', 'Unable to load Sightfile');
      }
    }
  };

  saveOpList = async () => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: 'Sightfile.json',
      properties: ['createDirectory'],
    });

    if (!canceled) {
      const { operations } = this.props;
      const instructions = operations.map((op) => op.toJson());
      fs.writeFileSync(
        filePath as string,
        JSON.stringify(instructions, null, 2)
      );
    }
  };

  idsToIndices = (ids: string[], operations: OpItem[]) =>
    ids.map((opID) => operations.findIndex((o) => o.id === opID));

  exportAsPython = async () => {
    const { canceled, filePath: saveTo } = await dialog.showSaveDialog({
      defaultPath: 'Sight.zip',
      properties: ['createDirectory'],
    });

    if (!canceled) {
      const { operations } = this.props;
      exportScript(operations, async (err, archive) => {
        if (err) {
          notify('warning', 'Failed to export');
        } else {
          fs.renameSync(archive, saveTo as string);
        }
      });
    }
  };

  insertOp = (fullOpName: string, index: number) => {
    const { insertOp } = this.props;
    const [pack, name] = fullOpName.split('.');
    let newOp: OpItem;
    if (name.startsWith('__')) {
      const trimmedName = name.substring(2);
      newOp = new OpItem(trimmedName, 'custom', true);
      upsert('custom', trimmedName, (err) => {
        if (!err) {
          insertOp(newOp, index);
          this.setState({ installedScripts: listScripts() });
        }
      });
    } else {
      newOp = new OpItem(name, pack as 'custom' | 'builtin');
      insertOp(newOp, index);
    }
  };

  removeScript = (rmop: OpItem) => {
    const { operations, setOperations } = this.props;

    rmScript(rmop.package, rmop.name);
    const reducedOperations = operations.filter(
      (o) => o.package !== rmop.package || o.name !== rmop.name
    );
    this.setState({
      installedScripts: listScripts(),
    });

    setOperations(reducedOperations);
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

    // function items grouped by first char
    const fnItemGroup = Object.entries(
      groupByFirstChar(installedScripts.builtin, installedScripts.custom)
    ).map(([char, names]) => (
      <Menu.ItemGroup key={char} title={char}>
        {names.map(([pack, m_name]) => {
          const color = pack === 'builtin' ? '#f14668' : '#f0a500';
          return (
            <Menu.Item style={{ color }} key={`${pack}.${m_name}`}>
              {m_name}
            </Menu.Item>
          );
        })}
      </Menu.ItemGroup>
    ));

    // drawer component for creating a new custom function
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
                  // at least three letters
                  const pattern = /^[A-Za-z_]\w{2,}$/;

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
        {fnItemGroup}
      </Menu>
    );

    // operation list consisting of builtin and custom function item groups
    const opItems = operations.map((op, index) => {
      // Menu.Item.onClick and Popconfirm are mutually exclusive
      // only show Popconfirm when moving away from a unsaved op.
      const popconfirmDisabled = resultUpToDate || selectedKey === op.id;

      return (
        <Menu.Item
          style={{ paddingRight: '0' }}
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
              <Text ellipsis={{ tooltip: op.name }} style={{ width: 85 }}>
                {op.name}
              </Text>
              <div>
                <Dropdown
                  trigger={['click']}
                  overlay={dropdownMenu(index)}
                  overlayStyle={{
                    width: 256,
                    maxHeight: '100vh',
                    overflowY: 'auto',
                  }}
                >
                  <Button
                    type="text"
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                {!op.loading && op.package === 'custom' && (
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
                    <Button
                      style={{ width: '24px', padding: '0px 4px' }}
                      type="text"
                      size="small"
                      danger
                    >
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

export default OperationPanel;
