import {
  CaretRightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import Editor, { loader } from '@monaco-editor/react';
import { Alert, Divider, Layout, Tooltip } from 'antd';
import debounce from 'lodash.debounce';
import path from 'path';
import React, { Component } from 'react';
import './App.global.css';
import Gallery from './components/Gallery';
import OpList from './components/OpList';
import Operation from './Operation';
import { notify, run } from './utils';

const { ErrorBoundary } = Alert;
const { Header, Content, Footer, Sider } = Layout;

loader.config({
  paths: { vs: path.join(__dirname, 'monaco', 'vs') },
});

interface IAppState {
  collapsed: boolean;
  selectedOp: Operation;
  selectionIndex: number;
  operations: Operation[];
}

class App extends Component<unknown, IAppState> {
  constructor(props: unknown) {
    super(props);

    const imread = new Operation('imread', 'builtin');
    const canny = new Operation('canny', 'builtin');
    const operations = [imread, canny];
    const selectionIndex = 0;
    const selection = operations[selectionIndex];
    this.state = {
      collapsed: false,
      selectedOp: selection,
      selectionIndex,
      operations,
    };
  }

  execOperations = (index?: number) => {
    const { operations, selectionIndex } = this.state;
    if (index === undefined) {
      index = selectionIndex; // eslint-disable-line no-param-reassign
    }

    const refreshSeq = operations.slice(index);

    // use the last result hash as the input hash of this operation sequence
    // unless this operation sequence starts from the beginning
    const lastResultHash =
      index > 0 ? operations[index - 1].resultImageHash : '';

    // cancel execution and ask to evaluate an immediately previous `imread` if the first operation doesn't have an input result hash
    if (
      refreshSeq.length > 0 &&
      refreshSeq[0].name !== 'imread' &&
      !lastResultHash
    ) {
      notify('warning', 'Please execute Imread first.');
      return;
    }

    // set all pending operations' loading flag before run
    refreshSeq.forEach((o: Operation) => {
      o.loading = true;
    });
    this.setState({ operations });

    try {
      run(
        refreshSeq,
        lastResultHash,
        (err: Error | null, op: Operation | null, result: string) => {
          if (!op) {
            // no op, should only occurs when the server failed
            if (err) {
              // server error if there's an error but no op
              // notify and reset all loading operations
              notify('error', err.message);
              refreshSeq.forEach((o: Operation) => {
                o.loading = false;
              });
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
              op.resultImageHash = '';
              op.inputImageHash = '';
            } else {
              // everything's fine, update the result hash and if applicable the input hash

              op.resultImageHash = result;
              // get the immediate predecessor and update this op's inputImageHash
              const selfIndx = operations.findIndex((p) => p.id === op.id);
              const preIndx = selfIndx - 1;
              if (preIndx >= 0 && op.name !== 'imread') {
                op.inputImageHash = operations[preIndx].resultImageHash;
              }
            }
          }
          // all set, update operations' status
          this.setState({ operations });
        }
      );
    } catch (e) {
      refreshSeq.forEach((op: Operation) => {
        op.loading = false;
      });
      this.setState({ operations });
      notify('error', e);
    }
  };

  evalDebounced: (index?: number) => void = debounce(this.execOperations, 200); // eslint-disable-line react/sort-comp

  toggleOpList = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  /**
   * Change the currently selected operation and the corresponding index.
   * @param op The new selected operation.
   */
  selectOp = (op: Operation, index: number) => {
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
  insertOp = (op: Operation, index: number) => {
    const { operations } = this.state;
    const selectionIndex = index + 1;
    const selection = op;
    operations.splice(selectionIndex, 0, op);

    // automatically execute the new selected operation and its successors
    // if it's not imread and its immediate predecessor is evaluated
    if (selection.name !== 'imread') {
      const lastResultHash =
        selectionIndex > 0
          ? operations[selectionIndex - 1].resultImageHash
          : '';
      if (lastResultHash) {
        this.evalDebounced(selectionIndex);
      }
    }

    this.selectOp(op, selectionIndex);
    this.setState({ operations });
  };

  /**
   * Remove the operation at the index and select the operation after it.
   * Re-calculate all operations after the removed operation.
   * @param index Index of the operation to be removed.
   */
  removeOp = (index: number) => {
    const { operations } = this.state;
    operations.splice(index, 1);

    // prevent index overflow if the removed op was the last one
    const selectionIndex = Math.min(index, operations.length - 1);
    const selection = operations[selectionIndex];

    // automatically execute the new selected operation and its successors
    // if it's not imread and its immediate predecessor is evaluated
    if (selection.name !== 'imread') {
      const lastResultHash =
        selectionIndex > 0
          ? operations[selectionIndex - 1].resultImageHash
          : '';

      if (lastResultHash && selection.inputImageHash !== lastResultHash) {
        this.evalDebounced(selectionIndex);
      }
    }

    this.selectOp(selection, selectionIndex);
    this.setState({ operations });
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

  render() {
    const { collapsed, operations, selectedOp } = this.state;
    const { ControlPanel } = selectedOp;
    return (
      <ErrorBoundary>
        <Layout>
          <Sider
            theme="light"
            width={220}
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
            <OpList
              selectedKey={selectedOp.id}
              resultUpToDate={selectedOp.resultUpToDate}
              operations={operations}
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
                    <CaretRightOutlined
                      className="trigger"
                      onClick={() => this.evalDebounced()}
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
                  // onValidate={(marker) => console.log(marker)}
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
                  onChange={this.evalDebounced}
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
              <Gallery operations={operations} selectedKey={selectedOp.id} />
            </Footer>
          </Layout>
        </Layout>
      </ErrorBoundary>
    );
  }
}

export default App;
