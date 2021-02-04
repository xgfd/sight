import {
  CaretRightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import Editor, { loader } from '@monaco-editor/react';
import { Alert, Divider, Layout } from 'antd';
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
  paths: { vs: path.join(__dirname, 'assets', 'monaco', 'vs') },
});

interface IAppState {
  collapsed: boolean;
  script: string;
  selectedOp: Operation;
  selectionIndex: number;
  operations: Operation[];
  currentRetHash: string;
}
class App extends Component<unknown, IAppState> {
  evalOpSeq = debounce((index?: number) => {
    const { operations, selectionIndex } = this.state;
    if (index === undefined) {
      /* eslint-disable-next-line */
      index = selectionIndex;
    }
    const lastResultHash =
      index > 0 ? operations[index - 1].resultImageHash : '';
    const refreshSeq = operations.slice(index);

    // unless it's imread, cancel execution if the first operation doesn't have an input result hash
    if (
      refreshSeq.length > 0 &&
      refreshSeq[0].name !== 'imread' &&
      !refreshSeq[0].resultImageHash
    ) {
      notify('warning', 'Please execute Imread first.');
      return;
    }
    // set all pending operations' loading flag
    const beforeRun = () => {
      refreshSeq.forEach((op: Operation) => {
        op.loading = true;
      });
      this.setState({ operations });
    };

    run(
      refreshSeq,
      lastResultHash,
      beforeRun,
      (op: Operation, result: string) => {
        op.loading = false;
        this.setState({ operations: [...operations], currentRetHash: result });
        console.log(result);
      }
    );
  }, 200);

  constructor(props: unknown) {
    super(props);

    const imread = new Operation('imread', 'builtin');
    const canny = new Operation('canny', 'builtin');
    const operations = [imread, canny];
    const selectionIndex = 0;
    const currentRetHash = '';
    this.state = {
      collapsed: false,
      script: operations[selectionIndex].getScript(),
      selectedOp: operations[selectionIndex],
      selectionIndex,
      operations,
      currentRetHash,
    };
  }

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
    // notify('info', op.name, op.id);
    this.setState({
      selectedOp: op,
      script: op.getScript(),
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
    operations.splice(index + 1, 0, op);
    this.setState({ operations });
    this.selectOp(op, index + 1);
  };

  /**
   * Remove the operation at the index and select the operation after it.
   * Re-calculate all operations after the removed operation.
   * @param index Index of the operation to be removed.
   */
  removeOp = (index: number) => {
    const { operations } = this.state;
    operations.splice(index, 1);

    // if it's not the last operation
    // select the next operation in line and
    // refresh all operations after the removed operation
    if (index < operations.length) {
      this.evalOpSeq(index);
      this.selectOp(operations[index], index);
    } else {
      this.selectOp(operations[index - 1], index - 1);
    }
    this.setState({ operations });
  };

  setEditorContent = (script: string) => {
    this.setState({
      script,
    });
  };

  render() {
    const options = {
      selectOnLineNumbers: true,
    };
    const {
      collapsed,
      script,
      operations,
      selectedOp,
      currentRetHash,
    } = this.state;
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
              overflow: 'auto',
              height: '100vh',
              position: 'sticky',
              top: 0,
              left: 0,
            }}
          >
            <OpList
              selectedKey={selectedOp.id}
              saved={selectedOp.saved}
              operations={operations}
              selectOp={this.selectOp}
              insertOp={this.insertOp}
              removeOp={this.removeOp}
            />
          </Sider>
          <Layout className="site-layout">
            <Header
              className="site-layout-background"
              style={{
                position: 'fixed',
                zIndex: 1,
                width: '100%',
                padding: 0,
              }}
            >
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: 'trigger',
                  onClick: this.toggleOpList,
                }
              )}
              <Divider type="vertical" />
              <CaretRightOutlined className="trigger" />
            </Header>
            <Layout
              style={{
                marginTop: 64,
                height: 'calc(100vh - 64px - 110px)',
              }}
            >
              <Content className="site-layout-background">
                <Editor defaultLanguage="python" value={script} />
              </Content>
              <Sider
                theme="light"
                width={220}
                collapsedWidth={0}
                style={{
                  overflow: 'auto',
                  padding: 10,
                }}
              >
                <ControlPanel
                  key={selectedOp.id}
                  selectedOp={selectedOp}
                  onChange={this.evalOpSeq}
                />
              </Sider>
            </Layout>
            <Footer
              style={{
                overflow: 'auto',
                padding: 10,
                height: 110,
              }}
            >
              <Gallery
                operations={operations}
                selectedKey={selectedOp.id}
                key={currentRetHash}
              />
            </Footer>
          </Layout>
        </Layout>
      </ErrorBoundary>
    );
  }
}

export default App;
