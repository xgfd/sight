import { UploadOutlined } from '@ant-design/icons';
import { Button, Select, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import path from 'path';
import React from 'react';
import ControlsBase, { OpControlsProp } from './ControlsBase';

const { Option } = Select;
export default class ImreadControls extends ControlsBase {
  static defaultValues = ['', 0];

  constructor(props: OpControlsProp) {
    super(props);
    const { name, args } = props.selectedOp;
    const fileArgs = [...args];
    fileArgs[0] = this.pathToRcFile(fileArgs[0]);
    this.state = { name, args: fileArgs, live: false, inputRefs: [] };
  }

  beforeUpload = (file: RcFile) => {
    const { selectedOp } = this.props;
    selectedOp.updateArgs(0, file.path);
    const fileArgs = [...selectedOp.args];
    file.uid = selectedOp.id;
    fileArgs[0] = file;
    this.setState({ args: fileArgs });
    return false;
  };

  handleUpload = () => {
    this.props.onChange();
  };

  pathToRcFile(filePath: string) {
    const file = {
      uid: this.props.selectedOp.id,
      path: filePath,
      name: path.basename(filePath),
    };
    return file;
  }

  updateArgs = (index: number, value: any) => {
    const { selectedOp } = this.props;
    selectedOp.updateArgs(index, value);
    const fileArgs = [...selectedOp.args];
    fileArgs[0] = this.pathToRcFile(fileArgs[0]);
    this.setState({ name: selectedOp.name, args: fileArgs });
  };

  render() {
    const { name, args } = this.state;
    const file: RcFile = args[0];
    const fileList = file.name ? [file] : [];
    return (
      <>
        <h2>{name}</h2>
        <h4>Read image</h4>
        <Upload
          beforeUpload={this.beforeUpload}
          fileList={fileList}
          onRemove={() => {
            this.updateArgs(0, '');
            return true;
          }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <h4>Mode</h4>
        <Select
          value={args[1]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(1, value)}
        >
          <Option value={-1}>UNCHANGED</Option>
          <Option value={0}>GRAYSCALE</Option>
          <Option value={1}>COLOR</Option>
          <Option value={2}>ANYDEPTH</Option>
          <Option value={4}>ANYCOLOR</Option>
          <Option value={8}>LOAD_GDAL</Option>
          <Option value={16}>REDUCED_GRAYSCALE_2</Option>
          <Option value={17}>REDUCED_COLOR_2</Option>
          <Option value={32}>REDUCED_GRAYSCALE_4</Option>
          <Option value={33}>REDUCED_COLOR_4</Option>
          <Option value={64}>REDUCED_GRAYSCALE_8</Option>
          <Option value={65}>REDUCED_COLOR_8</Option>
          <Option value={128}>IGNORE_ORIENTATION</Option>
        </Select>
        <br />
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          style={{ marginTop: 16 }}
        >
          Start
        </Button>
      </>
    );
  }
}
