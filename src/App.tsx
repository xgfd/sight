import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import Editor, { loader } from '@monaco-editor/react';
import { Alert, Divider, Layout, Tooltip } from 'antd';
import debounce from 'lodash.debounce';
import path from 'path';
import React, { Component } from 'react';
import './App.global.css';
import Gallery from './components/Gallery';
import OperationPanel from './components/OperationPanel';
import OpItem from './Operation';
import { Instruction } from './type';
import { notify, run, upsert } from './utils';

const { ErrorBoundary } = Alert;
const { Header, Content, Footer, Sider } = Layout;

loader.config({
  paths: { vs: path.join(__dirname, 'monaco', 'min', 'vs') },
});

interface IAppState {
  collapsed: boolean;
  selectedOp: OpItem;
  selectionIndex: number;
  operations: OpItem[];
}

function firstDiff(arr: OpItem[], newArr: OpItem[]) {
  let i;
  for (i = 0; i < arr.length; i += 1) {
    if (arr[i].id !== (newArr[i] || {}).id) {
      break;
    }
  }
  return Math.min(i, newArr.length - 1);
}

class App extends Component<unknown, IAppState> {
  constructor(props: unknown) {
    super(props);

    const imread = new OpItem('imread', 'builtin');
    const gaussian = new OpItem('GaussianBlur', 'builtin');
    const threshold = new OpItem('threshold', 'builtin');
    const morphology = new OpItem('morphologyEx', 'builtin');
    const findcontours = new OpItem('findContours', 'builtin');
    const filtercontours = new OpItem('filterContours', 'builtin');
    const operations = [
      imread,
      gaussian,
      threshold,
      morphology,
      findcontours,
      filtercontours,
    ];
    const selectionIndex = 0; // index of the currently selected op
    const selection = operations[selectionIndex]; // the currently selected op
    this.state = {
      collapsed: false,
      selectedOp: selection,
      selectionIndex,
      operations,
    };
  }

  private idToRef = (id: string) => {
    const { operations, selectionIndex } = this.state;
    const index = operations.findIndex((op) => op.id === id);

    if (index === -1) {
      return -1;
    }

    if (index < selectionIndex) {
      return operations[index].resultHash;
    }

    return index - selectionIndex;
  };

  execOperations = (index?: number) => {
    let { operations } = this.state;
    const { selectionIndex } = this.state;

    const seqStartIndx = index || selectionIndex;

    let execSequence = operations.slice(seqStartIndx);

    // use the last result hash as the input hash of this operation sequence
    // unless this operation sequence starts from the beginning
    const lastResultHash =
      seqStartIndx > 0 ? operations[seqStartIndx - 1].resultHash : '';

    // cancel execution and ask to evaluate an immediately previous `imread` if the first operation doesn't have an input result hash
    if (
      execSequence.length > 0 &&
      execSequence[0].name !== 'imread' &&
      !lastResultHash
    ) {
      // notify('warning', 'Please execute Imread first.');
      return;
    }

    const instructions: Instruction[] = [];

    for (let i = 0; i < execSequence.length; i += 1) {
      const op = execSequence[i];

      const opJson = op.toJson();
      const inputRefs = opJson.extra_inputs.map(this.idToRef);
      // break if some ops are missing inputs
      if (inputRefs.some((ref) => ref === -1)) {
        if (i > 0) {
          notify('warning', `${op.name}: Missing required image`);
          this.selectOp(operations[i + seqStartIndx], i + seqStartIndx);
        }
        break;
      }

      const inst = { ...opJson, extra_inputs: inputRefs } as Instruction;
      // add the input hash for the first operation
      if (i === 0) {
        inst.last_hash = lastResultHash;
      }
      instructions.push(inst);
    }

    if (instructions.length === 0) {
      return;
    }

    // truncate to the same length as instructions
    execSequence = execSequence.slice(0, instructions.length);

    // set all pending operations' loading flag before run
    execSequence.forEach((o: OpItem) => {
      o.loading = true;
    });

    this.setState({ operations });

    try {
      run(
        execSequence,
        instructions,
        (err: Error | null, op: OpItem | null, result: string) => {
          if (!op) {
            // no op, should only occurs when the server failed
            if (err) {
              // server error if there's an error but no op
              // notify and reset all loading operations
              notify('error', err.message);
              execSequence.forEach((o: OpItem) => {
                o.loading = false;
              });
              // the operation list might have changed during execution
              operations = this.state.operations; //eslint-disable-line
              this.setState({ operations });
            } else {
              // shouldn't reach this point
              // check the code of `run` if you see the following notification
              notify('error', 'Response with no associated operation');
            }
          } else {
            // this op finished execution whether it's successful or not
            op.loading = false;

            if (err) {
              // this op failed
              notify('warning', `${op.name}: ${err.message}`);
              // reset its own result hash and input hash
              op.resultHash = '';
              op.inputImageHash = '';
            } else {
              // everything's fine, update the result hash and if applicable the input hash

              op.resultHash = result;
              // get the immediate predecessor and update this op's inputImageHash
              const selfIndx = operations.findIndex((p) => p.id === op.id);
              const preIndx = selfIndx - 1;
              if (preIndx >= 0 && op.name !== 'imread') {
                op.inputImageHash = operations[preIndx].resultHash;
              }
            }
          }
          // all set, update operations' status
          // the operation list might have changed during execution
          operations = this.state.operations; //eslint-disable-line
          this.setState({ operations });
        }
      );
    } catch (e) {
      execSequence.forEach((op: OpItem) => {
        op.loading = false;
      });
      // the operation list might have changed during execution
      operations = this.state.operations; //eslint-disable-line
      this.setState({ operations });
      notify('error', e);
    }
  };

  evalDebounced: (index?: number) => void = debounce(this.execOperations, 100); // eslint-disable-line react/sort-comp

  /**
   * Set the operation list and selected operation. Evaluate the selected operation and its successors if needed.
   * @param operations New operation list.
   * @param selectionIndex Selected operation index.
   */
  setOperations = (operations: OpItem[]) => {
    const { operations: preOperations } = this.state;
    const selectionIndex = firstDiff(preOperations, operations);
    const selection = operations[selectionIndex];
    this.setState({
      selectedOp: selection,
      selectionIndex,
      operations,
    });

    // execute the new selected operation and its successors if
    // 1) it's not imread, and
    // 2) its immediate predecessor is evaluated, and
    // 3) its input hash is different from the predecessor's output hash.
    if (selection.name !== 'imread') {
      const preResultHash =
        selectionIndex > 0 ? operations[selectionIndex - 1].resultHash : '';

      if (preResultHash && selection.inputImageHash !== preResultHash) {
        this.evalDebounced(selectionIndex);
      }
    }
  };

  /**
   * Change the currently selected operation and the corresponding index.
   * @param op The new selected operation.
   */
  selectOp = (op: OpItem, index: number) => {
    this.setState({
      selectedOp: op,
      selectionIndex: index,
    });
  };

  /**
   * Insert a new operation after the given index and select the new operation.
   * Re-calculation is performed after the content of new insertion is saved,
   * i.e. trigger by the editor save button.
   * @param op The operation to be inserted.
   * @param index The index to insert a new operation.
   */
  insertOp = (op: OpItem, index: number) => {
    const { operations } = this.state;
    const newOperations = [...operations];
    newOperations.splice(index + 1, 0, op);
    this.setOperations(newOperations);
  };

  /**
   * Remove the operation at the index and select the operation after it.
   * Re-calculate all operations after the removed operation.
   * @param index Index of the operation to be removed.
   */
  removeOp = (index: number) => {
    const { operations } = this.state;
    const newOperations = [...operations];
    newOperations.splice(index, 1);
    this.setOperations(newOperations);
  };

  toggleOpList = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  onEditorChange = (script: string | undefined) => {
    if (script === undefined) {
      return;
    }

    const { selectedOp } = this.state;
    if (selectedOp.package !== 'builtin') {
      selectedOp.updateScript(script);
    } else {
      notify(
        'warning',
        'Builtin functions are readonly and changes are discarded'
      );
    }
    this.setState({ selectedOp });
  };

  onRunClicked = () => {
    const { operations, selectedOp } = this.state;
    upsert(selectedOp.package, selectedOp.name, (err) => {
      if (!err) {
        let firstOccurrence: number | undefined;
        operations.forEach((o, index) => {
          if (o.name === selectedOp.name) {
            if (firstOccurrence === undefined) {
              firstOccurrence = index;
            }
            o.updateScript(selectedOp.script);
          }
        });
        this.evalDebounced(firstOccurrence);
        this.setState({ operations });
      }
    });
  };

  render() {
    const { collapsed, operations, selectedOp, selectionIndex } = this.state;
    const { ControlPanel } = selectedOp;
    return (
      <ErrorBoundary>
        <Layout>
          <Sider
            theme="light"
            width={235}
            trigger={null}
            collapsible
            collapsedWidth="0"
            collapsed={collapsed}
            style={{
              overflowY: 'auto',
              height: '100vh',
              position: 'sticky',
              top: 0,
              left: 0,
            }}
          >
            <OperationPanel
              selectedKey={selectedOp.id}
              resultUpToDate={selectedOp.resultUpToDate}
              operations={operations}
              setOperations={this.setOperations}
              selectOp={this.selectOp}
              insertOp={this.insertOp}
              removeOp={this.removeOp}
            />
          </Sider>
          <Layout className="site-layout">
            <Header
              key={selectedOp.resultUpToDate ? 0 : 1}
              className="site-layout-background"
              style={{
                position: 'fixed',
                zIndex: 1,
                width: '100%',
                padding: 0,
              }}
            >
              {collapsed ? (
                <MenuUnfoldOutlined
                  className="trigger"
                  onClick={this.toggleOpList}
                />
              ) : (
                <MenuFoldOutlined
                  className="trigger"
                  onClick={this.toggleOpList}
                />
              )}

              {selectedOp.name !== 'imread' && !selectedOp.resultUpToDate ? (
                <>
                  <Divider type="vertical" />
                  <Tooltip title="Run">
                    <SyncOutlined
                      className="trigger"
                      onClick={this.onRunClicked}
                    />
                  </Tooltip>
                </>
              ) : (
                <></>
              )}
            </Header>
            <Layout
              style={{
                marginTop: 64,
                height: 'calc(100vh - 64px - 207px)', // header=64px, footer=207px, in sync with Footer.style.height
              }}
            >
              <Content className="site-layout-background">
                <Editor
                  defaultLanguage="python"
                  language="python"
                  value={selectedOp.script}
                  options={{ readOnly: selectedOp.package === 'builtin' }}
                  onChange={this.onEditorChange}
                />
              </Content>
              <Sider
                theme="light"
                width={220}
                collapsedWidth={0}
                style={{
                  overflowY: 'auto',
                  padding: 10,
                }}
              >
                <ControlPanel
                  key={selectedOp.id}
                  selectedOp={selectedOp}
                  operations={operations}
                  index={selectionIndex}
                  onChange={() => {
                    this.evalDebounced();
                    this.setState({ selectedOp });
                  }}
                />
              </Sider>
            </Layout>
            <Footer
              style={{
                overflowX: 'auto',
                overflowY: 'hidden',
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 7, // leave room for badge icons, it's the half hight of the clock icon
                paddingBottom: 0,
                height: 207,
                backgroundColor: '#fafafa',
              }}
            >
              <Gallery operations={operations} selectedOp={selectedOp} />
            </Footer>
          </Layout>
        </Layout>
      </ErrorBoundary>
    );
  }
}

export default App;
