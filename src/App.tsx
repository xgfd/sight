import {
  AppstoreOutlined,
  BarChartOutlined,
  CaretRightOutlined,
  CloudOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import Editor, { loader } from '@monaco-editor/react';
import {
  Button,
  Divider,
  Image,
  InputNumber,
  Layout,
  Menu,
  Slider,
  Space,
  Spin,
} from 'antd';
import path from 'path';
import React, { Component } from 'react';
import './App.global.css';
// import icon from '../assets/icon.svg';

loader.config({
  paths: { vs: path.join(__dirname, 'assets', 'monaco', 'vs') },
});

const { Header, Content, Footer, Sider } = Layout;
class App extends Component<unknown, { collapsed: boolean }> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  render() {
    const options = {
      selectOnLineNumbers: true,
    };
    const { collapsed } = this.state;
    return (
      <Layout>
        <Sider
          theme="light"
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
          {/* <div className="logo" /> */}
          <Menu
            mode="inline"
            // defaultSelectedKeys={["4"]}
            style={{ minHeight: '100%' }}
          >
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Space size="middle">
                step 1
                <div style={{ textAlign: 'center' }}>
                  <Button type="text" size="small">
                    +
                  </Button>
                  <Button type="text" size="small" danger />
                </div>
                <Spin delay={200} size="small" />
              </Space>
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              step 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              step 3
            </Menu.Item>
            <Menu.Item key="4" icon={<BarChartOutlined />}>
              step 4
            </Menu.Item>
            <Menu.Item key="5" icon={<CloudOutlined />}>
              step 5
            </Menu.Item>
            <Menu.Item key="6" icon={<AppstoreOutlined />}>
              step 6
            </Menu.Item>
            <Menu.Item key="7" icon={<TeamOutlined />}>
              <Space size="middle">
                step 7
                <div style={{ textAlign: 'center' }}>
                  <Button type="text" size="small">
                    +
                  </Button>
                  <Button type="text" size="small" danger>
                    -
                  </Button>
                </div>
              </Space>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{ position: 'fixed', zIndex: 1, width: '100%', padding: 0 }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: this.toggle,
              }
            )}
            <Divider type="vertical" />
            <CaretRightOutlined className="trigger" />
          </Header>
          <Layout
            style={{
              marginTop: 64,
              height: 'calc(100vh - 64px - 90px)',
            }}
          >
            <Content className="site-layout-background">
              <Editor
                defaultLanguage="python"
                defaultValue="import cv2
import numpy as np"
              />
            </Content>
            <Sider
              theme="light"
              // collapsible
              collapsedWidth={0}
              // reverseArrow
              style={{
                overflow: 'auto',
                padding: 10,
              }}
            >
              <h4>Threshold 1</h4>
              <Slider range max={360} defaultValue={[20, 50]} />
              <h4>Threshold 2</h4>
              <Slider defaultValue={50} />
              <h4>Threshold 3</h4>
              <Slider defaultValue={20} />
              <h4>k-size</h4>
              <InputNumber min={1} max={255} step={2} defaultValue={3} />
              <InputNumber min={1} max={255} step={2} defaultValue={3} />
            </Sider>
          </Layout>
          <Footer
            style={{
              // position: "sticky",
              // bottom: 0,
              overflow: 'auto',
              padding: 10,
              height: 90,
            }}
          >
            <Image.PreviewGroup>
              <Space>
                <Image
                  // height={70}
                  width={70}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
                <Image
                  // height={70}
                  width={70}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
                <Image
                  // height={70}
                  width={70}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </Space>
            </Image.PreviewGroup>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
