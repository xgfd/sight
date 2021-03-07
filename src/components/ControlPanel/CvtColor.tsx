import { Select } from 'antd';
import React from 'react';
import ControlsBase from './ControlsBase';

const { Option, OptGroup } = Select;

export default class CvtColorControls extends ControlsBase {
  static defaultValues = [46];

  render() {
    const { name, args } = this.state;

    return (
      <>
        <h2>{name}</h2>
        <h4>Color conversion code</h4>
        <Select
          value={args[0]}
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={(value) => this.updateArgs(0, value)}
        >
          <OptGroup label="Alpha channel">
            <Option value={0}>COLOR_BGR2BGRA</Option>
            <Option value={1}>COLOR_BGRA2BGR</Option>
            <Option value={2}>COLOR_BGR2RGBA</Option>
            <Option value={3}>COLOR_RGBA2BGR</Option>
            <Option value={4}>COLOR_BGR2RGB</Option>
            <Option value={5}>COLOR_BGRA2RGBA</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> Gray">
            <Option value={6}>COLOR_BGR2GRAY</Option>
            <Option value={7}>COLOR_RGB2GRAY</Option>
            <Option value={8}>COLOR_GRAY2BGR</Option>
            <Option value={9}>COLOR_GRAY2BGRA</Option>
            <Option value={10}>COLOR_BGRA2GRAY</Option>
            <Option value={11}>COLOR_RGBA2GRAY</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> BGR565">
            <Option value={12}>COLOR_BGR2BGR565</Option>
            <Option value={13}>COLOR_RGB2BGR565</Option>
            <Option value={14}>COLOR_BGR5652BGR</Option>
            <Option value={15}>COLOR_BGR5652RGB</Option>
            <Option value={16}>COLOR_BGRA2BGR565</Option>
            <Option value={17}>COLOR_RGBA2BGR565</Option>
            <Option value={18}>COLOR_BGR5652BGRA</Option>
            <Option value={19}>COLOR_BGR5652RGBA</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> BGR565">
            <Option value={20}>COLOR_GRAY2BGR565</Option>
            <Option value={21}>COLOR_BGR5652GRAY</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> BGR555">
            <Option value={22}>COLOR_BGR2BGR555</Option>
            <Option value={23}>COLOR_RGB2BGR555</Option>
            <Option value={24}>COLOR_BGR5552BGR</Option>
            <Option value={25}>COLOR_BGR5552RGB</Option>
            <Option value={26}>COLOR_BGRA2BGR555</Option>
            <Option value={27}>COLOR_RGBA2BGR555</Option>
            <Option value={28}>COLOR_BGR5552BGRA</Option>
            <Option value={29}>COLOR_BGR5552RGBA</Option>
          </OptGroup>
          <OptGroup label="Gray <-> BGR555">
            <Option value={30}>COLOR_GRAY2BGR555</Option>
            <Option value={31}>COLOR_BGR5552GRAY</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> CIE XYZ">
            <Option value={32}>COLOR_BGR2XYZ</Option>
            <Option value={33}>COLOR_RGB2XYZ</Option>
            <Option value={34}>COLOR_XYZ2BGR</Option>
            <Option value={35}>COLOR_XYZ2RGB</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> YCC">
            <Option value={36}>COLOR_BGR2YCrCb</Option>
            <Option value={37}>COLOR_RGB2YCrCb</Option>
            <Option value={38}>COLOR_YCrCb2BGR</Option>
            <Option value={39}>COLOR_YCrCb2RGB</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> HSV">
            <Option value={40}>COLOR_BGR2HSV</Option>
            <Option value={41}>COLOR_RGB2HSV</Option>
            <Option value={54}>COLOR_HSV2BGR</Option>
            <Option value={55}>COLOR_HSV2RGB</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> CIE Lab">
            <Option value={44}>COLOR_BGR2Lab</Option>
            <Option value={45}>COLOR_RGB2Lab</Option>
            <Option value={56}>COLOR_Lab2BGR</Option>
            <Option value={57}>COLOR_Lab2RGB</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> CIE Luv">
            <Option value={50}>COLOR_BGR2Luv</Option>
            <Option value={51}>COLOR_RGB2Luv</Option>
            <Option value={58}>COLOR_Luv2BGR</Option>
            <Option value={59}>COLOR_Luv2RGB</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> HLS">
            <Option value={52}>COLOR_BGR2HLS</Option>
            <Option value={53}>COLOR_RGB2HLS</Option>
            <Option value={60}>COLOR_HLS2BGR</Option>
            <Option value={61}>COLOR_HLS2RGB</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> HSV full">
            <Option value={66}>COLOR_BGR2HSV_FULL</Option>
            <Option value={67}>COLOR_RGB2HSV_FULL</Option>
            <Option value={70}>COLOR_HSV2BGR_FULL</Option>
            <Option value={71}>COLOR_HSV2RGB_FULL</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> HLS full">
            <Option value={68}>COLOR_BGR2HLS_FULL</Option>
            <Option value={69}>COLOR_RGB2HLS_FULL</Option>
            <Option value={72}>COLOR_HLS2BGR_FULL</Option>
            <Option value={73}>COLOR_HLS2RGB_FULL</Option>
          </OptGroup>
          <OptGroup label="LRGB/BGR <-> CIE Lab">
            <Option value={74}>COLOR_LBGR2Lab</Option>
            <Option value={75}>COLOR_LRGB2Lab</Option>
            <Option value={78}>COLOR_Lab2LBGR</Option>
            <Option value={79}>COLOR_Lab2LRGB</Option>
          </OptGroup>
          <OptGroup label="LRGB/BGR <-> CIE Luv">
            <Option value={76}>COLOR_LBGR2Luv</Option>
            <Option value={77}>COLOR_LRGB2Luv</Option>
            <Option value={80}>COLOR_Luv2LBGR</Option>
            <Option value={81}>COLOR_Luv2LRGB</Option>
          </OptGroup>
          <OptGroup label="RGB/BGR <-> YUV">
            <Option value={82}>COLOR_BGR2YUV</Option>
            <Option value={83}>COLOR_RGB2YUV</Option>
            <Option value={84}>COLOR_YUV2BGR</Option>
            <Option value={85}>COLOR_YUV2RGB</Option>
          </OptGroup>
          <OptGroup label="YUV 4:2:0 -> RGB/BGR">
            <Option value={90}>COLOR_YUV2RGB_NV12</Option>
            <Option value={91}>COLOR_YUV2BGR_NV12</Option>
            <Option value={92}>COLOR_YUV2RGB_NV21</Option>
            <Option value={93}>COLOR_YUV2BGR_NV21</Option>
            <Option value={92}>COLOR_YUV420sp2RGB</Option>
            <Option value={93}>COLOR_YUV420sp2BGR</Option>
            <Option value={94}>COLOR_YUV2RGBA_NV12</Option>
            <Option value={95}>COLOR_YUV2BGRA_NV12</Option>
            <Option value={96}>COLOR_YUV2RGBA_NV21</Option>
            <Option value={97}>COLOR_YUV2BGRA_NV21</Option>
            <Option value={98}>COLOR_YUV2RGB_YV12</Option>
            <Option value={99}>COLOR_YUV2BGR_YV12</Option>
            <Option value={100}>COLOR_YUV2RGB_IYUV</Option>
            <Option value={101}>COLOR_YUV2BGR_IYUV</Option>
            <Option value={102}>COLOR_YUV2RGBA_YV12</Option>
            <Option value={103}>COLOR_YUV2BGRA_YV12</Option>
            <Option value={104}>COLOR_YUV2RGBA_IYUV</Option>
            <Option value={105}>COLOR_YUV2BGRA_IYUV</Option>
            <Option value={106}>COLOR_YUV2GRAY_420</Option>
          </OptGroup>
          <OptGroup label="YUV 4:2:2 -> RGB/BGR">
            <Option value={107}>COLOR_YUV2RGB_UYVY</Option>
            <Option value={108}>COLOR_YUV2BGR_UYVY</Option>
            <Option value={111}>COLOR_YUV2RGBA_UYVY</Option>
            <Option value={112}>COLOR_YUV2BGRA_UYVY</Option>
            <Option value={115}>COLOR_YUV2RGB_YUY2</Option>
            <Option value={116}>COLOR_YUV2BGR_YUY2</Option>
            <Option value={117}>COLOR_YUV2RGB_YVYU</Option>
            <Option value={118}>COLOR_YUV2BGR_YVYU</Option>
            <Option value={119}>COLOR_YUV2RGBA_YUY2</Option>
            <Option value={120}>COLOR_YUV2BGRA_YUY2</Option>
            <Option value={121}>COLOR_YUV2RGBA_YVYU</Option>
            <Option value={122}>COLOR_YUV2BGRA_YVYU</Option>
            <Option value={123}>COLOR_YUV2GRAY_UYVY</Option>
            <Option value={124}>COLOR_YUV2GRAY_YUY2</Option>
          </OptGroup>
          <OptGroup label="alpha premultiplication">
            <Option value={125}>COLOR_RGBA2mRGBA</Option>
            <Option value={126}>COLOR_mRGBA2RGBA</Option>
          </OptGroup>
          <OptGroup label="RGB -> YUV 4:2:0">
            <Option value={127}>COLOR_RGB2YUV_I420</Option>
            <Option value={128}>COLOR_BGR2YUV_I420</Option>
            <Option value={129}>COLOR_RGBA2YUV_I420</Option>
            <Option value={130}>COLOR_BGRA2YUV_I420</Option>
            <Option value={131}>COLOR_RGB2YUV_YV12</Option>
            <Option value={132}>COLOR_BGR2YUV_YV12</Option>
            <Option value={133}>COLOR_RGBA2YUV_YV12</Option>
            <Option value={134}>COLOR_BGRA2YUV_YV12</Option>
          </OptGroup>
          <OptGroup label="Bayer -> RGB/BGR">
            <Option value={46}>COLOR_BayerBG2BGR</Option>
            <Option value={47}>COLOR_BayerGB2BGR</Option>
            <Option value={48}>COLOR_BayerRG2BGR</Option>
            <Option value={49}>COLOR_BayerGR2BGR</Option>
          </OptGroup>
          <OptGroup label="Bayer VNG -> RGB/BGR">
            <Option value={62}>COLOR_BayerBG2BGR_VNG</Option>
            <Option value={63}>COLOR_BayerGB2BGR_VNG</Option>
            <Option value={64}>COLOR_BayerRG2BGR_VNG</Option>
            <Option value={65}>COLOR_BayerGR2BGR_VNG</Option>
          </OptGroup>
          <OptGroup label="Bayer -> Gray">
            <Option value={86}>COLOR_BayerBG2GRAY</Option>
            <Option value={87}>COLOR_BayerGB2GRAY</Option>
            <Option value={88}>COLOR_BayerRG2GRAY</Option>
            <Option value={89}>COLOR_BayerGR2GRAY</Option>
          </OptGroup>
          <OptGroup label="Bayer Edge-Aware -> RGB/BGR">
            <Option value={135}>COLOR_BayerBG2BGR_EA</Option>
            <Option value={136}>COLOR_BayerGB2BGR_EA</Option>
            <Option value={137}>COLOR_BayerRG2BGR_EA</Option>
            <Option value={138}>COLOR_BayerGR2BGR_EA</Option>
          </OptGroup>
          <OptGroup label="Bayer-> RGBA/BGRA">
            <Option value={139}>COLOR_BayerBG2BGRA</Option>
            <Option value={140}>COLOR_BayerGB2BGRA</Option>
            <Option value={141}>COLOR_BayerRG2BGRA</Option>
            <Option value={142}>COLOR_BayerGR2BGRA</Option>
          </OptGroup>
        </Select>
      </>
    );
  }
}
