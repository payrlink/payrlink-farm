import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Typography,
  Card,
  Modal,
  Radio,
  DatePicker,
  Select,
  Input
} from "antd";

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

export default class StudyCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visible1: false
    };
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };
  showModal1 = () => {
    this.setState({
      visible1: true,
      visible: false
    });
  };

  showConfirm = () => {
    confirm({
      title: "Enter Screener",
      content: "Please click ok to enter the screener.",
      className: "info_modal_normal",
      okText: "Continue",
      centered: "true",
      icon: "none",
      cancelText: "Cancel",
      onOk() {
      },
      onCancel() {
      }
    });
  };

  scheduleInterview = () => {
    Modal.success({
      title: "Thank you!",
      centered: "true",
      icon: "none",
      content: (
        <p>Your interview is scheduled on November 8th at 11:30am (EST).</p>
      ),
      maskClosable: "true",
      width: "350px",
      maskStyle: { backgroundColor: "rgba(0, 39, 102, 0.7)" },
      className: "info_modal",
      onOk() {}
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel1 = async e => {
    this.setState({
      visible1: false
    });
  };

  onChange(e) {
    // console.log(`radio checked:${e.target.value}`);
  }

  render() {
    const { visible1 } = this.state;

    return (
      <div>
        <Row style={{ marginBottom: "2em" }}>
          <Col span="24">
            <Card bodyStyle={{ padding: "0" }}>
              <Row type="flex" justify="space-between">
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 18 }}
                  style={{ padding: "1em 1em" }}
                >
                  <span className="text_app_color text_large text_semibold">
                    An Atypical Presentation of Systemic Lupus Erythematosus
                  </span>
                </Col>
                <Col>
                  <div
                    className="bg_dgreen text_xlarge text_white text_semibold"
                    style={{ padding: "0.3em 1em" }}
                  >
                    $160
                  </div>
                </Col>

                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 18 }}
                  style={{ padding: "1em" }}
                >
                  <p>
                    Systemic Lupus Erythematosus (SLE) is a chronic autoimmune
                    disorder that affects almost every organ system in the body.
                    It has a predilection for non-Caucasian women of
                    child-bearing age and can cause serious complications in
                    many organ systems.
                  </p>
                </Col>
              </Row>
              <Row
                type="flex"
                style={{
                  padding: "0 1em 1em"
                }}
                gutter={[0, 16]}
              >
                <Col xs={{ span: 18 }} sm={{ span: 18 }} lg={{ span: 5 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Text className="text_gray-3">Project Manager:</Text>
                    <Text>Jurriaan van der Broek</Text>
                    <Text className="text_app_color_light">
                      +1 336-365-1841
                    </Text>
                    <Text className="text_app_color_light">
                      lawrencew@gmail.com
                    </Text>
                  </div>
                </Col>
                <Col xs={{ span: 18 }} sm={{ span: 18 }} lg={{ span: 3 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Text className="text_gray-3">Length:</Text>
                    <Text>90 Minutes</Text>
                  </div>
                </Col>
                <Col xs={{ span: 18 }} sm={{ span: 18 }} lg={{ span: 3 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Text className="text_gray-3">Start Date:</Text>
                    <Text>11/01/2019</Text>
                  </div>
                </Col>
                <Col xs={{ span: 18 }} sm={{ span: 18 }} lg={{ span: 3 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Text className="text_gray-3">End Date:</Text>
                    <Text>12/30/2019</Text>
                  </div>
                </Col>
                <Col xs={{ span: 18 }} sm={{ span: 18 }} lg={{ span: 5 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Text className="text_gray-3">Interview scheduled on</Text>
                    <Text>11/08/2019 11:30 AM (EST)</Text>
                  </div>
                </Col>
              </Row>
              <Row
                style={{ padding: "1em", borderTop: "1px solid #D9D9D9" }}
                type="flex"
                justify="space-between"
              >
                <Col>
                  <Button
                    className="link_button"
                    type="primary"
                    ghost
                    style={{ width: "auto", margin: "0.5em" }}
                    onClick={this.showModal}
                  >
                    See Availability
                  </Button>
                  <Radio.Group onChange={this.onChange}>
                    <Modal
                      visible={this.state.visible}
                      // onOk={this.handleOk}
                      onCancel={this.handleCancel}
                      width="80%"
                      footer={null}
                      centered
                      className="radio_timezone"
                    >
                      <Row
                        type="flex"
                        gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
                      >
                        <Col
                          xs={{ span: 18 }}
                          sm={{ span: 18 }}
                          lg={{ span: 6 }}
                        >
                          <span className="text_app_color text_large">
                            Available Interview Times
                          </span>
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          lg={{ span: 8 }}
                        >
                          <DatePicker placeholder="Search by date" style={{ width: "100%" }} />
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          lg={{ span: 8 }}
                        >
                          <Select
                            style={{ width: "100%" }}
                            placeholder="Select Timezone"
                            optionFilterProp="children"
                          >
                            <Option value="CST">Central Standard Time</Option>
                            <Option value="EST">Eastern Standard Time</Option>
                            <Option value="MST">Mountain Standard Time</Option>
                            <Option value="PST">Pacific Standard Time</Option>
                            <Option value="AST">Alaska Standard Time</Option>
                            <Option value="HSA">
                              Hawaii-Aleutian Standard Time
                            </Option>
                          </Select>
                        </Col>
                      </Row>
                      <Row
                        className="bg_gray-1"
                        type="flex"
                        align="middle"
                        style={{
                          padding: "5px 0",
                          marginBottom: "15px",
                          marginTop: "10px"
                        }}
                      >
                        <Col
                          xs={{ span: 6 }}
                          sm={{ span: 6 }}
                          md={{ span: 6 }}
                          lg={{ span: 3 }}
                          className="text_center"
                        >
                          <Text className="text_app_color text_normal">
                            Dates
                          </Text>
                        </Col>
                        <Col
                          xs={{ span: 18 }}
                          sm={{ span: 18 }}
                          md={{ span: 18 }}
                          lg={{ span: 21 }}
                        >
                          <Text
                            className="text_app_color text_normal"
                            style={{ paddingLeft: "20px" }}
                          >
                            Available times
                          </Text>
                        </Col>
                      </Row>
                      <div className="radio_timezone_body">
                        <Row type="flex">
                          <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                            lg={{ span: 3 }}
                            className="text_center time_wrapper"
                          >
                            <span
                              className="text_app_color text_normal"
                              style={{ display: "block" }}
                            >
                              12/30/2019
                            </span>
                            <span className="text_gray-4 text_medium">
                              Monday
                            </span>
                          </Col>
                          <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                            lg={{ span: 21 }}
                          >
                            <div className="btn_wrapper">
                              <Radio.Button value="1">10:30AM</Radio.Button>
                              <Radio.Button value="2">11:00AM</Radio.Button>
                              <Radio.Button value="3">11:30AM</Radio.Button>
                              <Radio.Button value="5">12:00PM</Radio.Button>
                              <Radio.Button value="6">12:30PM</Radio.Button>
                              <Radio.Button value="7">01:00PM</Radio.Button>
                              <Radio.Button value="8">01:30PM</Radio.Button>
                              <Radio.Button value="9">02:00PM</Radio.Button>
                              <Radio.Button value="10">02:30PM</Radio.Button>
                              <Radio.Button value="11">03:00PM</Radio.Button>
                              <Radio.Button value="12">03:30PM</Radio.Button>
                              <Radio.Button value="13">04:00PM</Radio.Button>
                              <Radio.Button value="14">04:30PM</Radio.Button>
                              <Radio.Button value="15">05:00PM</Radio.Button>
                              <Radio.Button value="16">05:30PM</Radio.Button>
                              <Radio.Button value="17">06:00PM</Radio.Button>
                            </div>
                          </Col>
                        </Row>
                        <Row type="flex">
                          <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                            lg={{ span: 3 }}
                            className="text_center time_wrapper"
                          >
                            <span
                              className="text_app_color text_normal"
                              style={{ display: "block" }}
                            >
                              12/31/2019
                            </span>
                            <span className="text_gray-4 text_medium">
                              Tuesday
                            </span>
                          </Col>
                          <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                            lg={{ span: 21 }}
                          >
                            <div
                              className="btn_wrapper"
                              style={{ border: "none" }}
                            >
                              <Radio.Button value="18">10:30AM</Radio.Button>
                              <Radio.Button value="19">11:00AM</Radio.Button>
                              <Radio.Button value="20">11:30AM</Radio.Button>
                              <Radio.Button value="21">12:00PM</Radio.Button>
                              <Radio.Button value="22">12:30PM</Radio.Button>
                              <Radio.Button value="23">01:00PM</Radio.Button>
                              <Radio.Button value="24">01:30PM</Radio.Button>
                              <Radio.Button value="25">02:00PM</Radio.Button>
                              <Radio.Button value="26">02:30PM</Radio.Button>
                              <Radio.Button value="27">03:00PM</Radio.Button>
                              <Radio.Button value="28">03:30PM</Radio.Button>
                              <Radio.Button value="29">04:00PM</Radio.Button>
                              <Radio.Button value="30">04:30PM</Radio.Button>
                              <Radio.Button value="31">05:00PM</Radio.Button>
                              <Radio.Button value="32">05:30PM</Radio.Button>
                              <Radio.Button value="33">06:00PM</Radio.Button>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <Row>
                        <Col span={24} className="radio_timezone_footer">
                          <Button
                            className="link_button"
                            type="primary"
                            style={{ width: "auto" }}
                            onClick={() => this.showModal1()}
                          >
                            Schedule interview
                          </Button>
                        </Col>
                      </Row>
                    </Modal>
                    <Modal
                      visible={visible1}
                      onCancel={this.handleCancel1}
                      footer={null}
                      centered
                      title="Schedule an Interview"
                      className="radio_timezone"
                    >
                      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 16 }]}>
                        <Col
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          lg={{ span: 7 }}
                        >
                          Interview Date:
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          lg={{ span: 17 }}
                        >
                          <DatePicker placeholder="Search by date" style={{ width: "100%" }} />
                        </Col>

                        <Col
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          lg={{ span: 7 }}
                        >
                          Select Timezone:
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          lg={{ span: 17 }}
                        >
                          <Select
                            style={{ width: "100%" }}
                            placeholder="Select Timezone"
                            optionFilterProp="children"
                          >
                            <Option value="CST">Central Standard Time</Option>
                            <Option value="EST">Eastern Standard Time</Option>
                            <Option value="MST">Mountain Standard Time</Option>
                            <Option value="PST">Pacific Standard Time</Option>
                            <Option value="AST">Alaska Standard Time</Option>
                            <Option value="HSA">
                              Hawaii-Aleutian Standard Time
                            </Option>
                          </Select>
                        </Col>
                      </Row>
                      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 16 }]}>
                        <Col
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          lg={{ span: 24 }}
                        >
                          Interview Time:
                          <div className="btn_scroll_wrapper">
                            <Radio.Button value="1">10:30AM</Radio.Button>
                            <Radio.Button value="2">11:00AM</Radio.Button>
                            <Radio.Button value="3">11:30AM</Radio.Button>
                            <Radio.Button value="5">12:00PM</Radio.Button>
                            <Radio.Button value="6">12:30PM</Radio.Button>
                            <Radio.Button value="7">01:00PM</Radio.Button>
                            <Radio.Button value="8">01:30PM</Radio.Button>
                            <Radio.Button value="9">02:00PM</Radio.Button>
                            <Radio.Button value="10">02:30PM</Radio.Button>
                            <Radio.Button value="11">03:00PM</Radio.Button>
                            <Radio.Button value="12">03:30PM</Radio.Button>
                            <Radio.Button value="13">04:00PM</Radio.Button>
                            <Radio.Button value="14">04:30PM</Radio.Button>
                            <Radio.Button value="15">05:00PM</Radio.Button>
                            <Radio.Button value="16">05:30PM</Radio.Button>
                            <Radio.Button value="17">06:00PM</Radio.Button>
                          </div>
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          lg={{ span: 24 }}
                        >
                          Add Additional note:
                          <div>
                            <TextArea
                              rows={3}
                              placeholder="E. g. - call me at a different number than is in my profile, call my admin, call me with reminder 5 min before."
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          span={24}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end"
                          }}
                        >
                          <Button
                            type="primary"
                            onClick={this.scheduleInterview}
                            style={{ marginRight: "10px" }}
                          >
                            Schedule
                          </Button>
                          <Button onClick={this.handleCancel1}>Cancel</Button>
                        </Col>
                      </Row>
                    </Modal>
                  </Radio.Group>
                </Col>
                <Col>
                  <Button
                    className="link_button"
                    type="primary"
                    style={{ width: "auto", margin: "0.5em" }}
                    onClick={() => this.showModal1()}
                  >
                    Schedule Interview
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col span="24">
            <Card bodyStyle={{ padding: "0" }}>
              <Row type="flex" justify="space-between">
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 18 }}
                  style={{ padding: "1em 1em" }}
                >
                  <span className="text_app_color text_large text_semibold">
                    An Atypical Presentation of Systemic Lupus Erythematosus
                  </span>
                </Col>
                <Col>
                  <div
                    className="bg_dgreen text_xlarge text_white text_semibold"
                    style={{ padding: "0.3em 1em" }}
                  >
                    $160
                  </div>
                </Col>

                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 18 }}
                  style={{ padding: "1em" }}
                >
                  <p>
                    Systemic Lupus Erythematosus (SLE) is a chronic autoimmune
                    disorder that affects almost every organ system in the body.
                    It has a predilection for non-Caucasian women of
                    child-bearing age and can cause serious complications in
                    many organ systems.
                  </p>
                </Col>
              </Row>
              <Row
                type="flex"
                style={{
                  padding: "0 1em 1em"
                }}
                gutter={[0, 16]}
              >
                <Col xs={{ span: 18 }} sm={{ span: 18 }} lg={{ span: 5 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Text className="text_gray-3">Project Manager:</Text>
                    <Text>Jurriaan van der Broek</Text>
                    <Text className="text_app_color_light">
                      +1 336-365-1841
                    </Text>
                    <Text className="text_app_color_light">
                      lawrencew@gmail.com
                    </Text>
                  </div>
                </Col>
                <Col xs={{ span: 18 }} sm={{ span: 18 }} lg={{ span: 3 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Text className="text_gray-3">Length:</Text>
                    <Text>90 Minutes</Text>
                  </div>
                </Col>
                <Col xs={{ span: 18 }} sm={{ span: 18 }} lg={{ span: 3 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Text className="text_gray-3">Start Date:</Text>
                    <Text>11/01/2019</Text>
                  </div>
                </Col>
                <Col xs={{ span: 18 }} sm={{ span: 18 }} lg={{ span: 3 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Text className="text_gray-3">End Date:</Text>
                    <Text>12/30/2019</Text>
                  </div>
                </Col>
                <Col xs={{ span: 18 }} sm={{ span: 18 }} lg={{ span: 5 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Text className="text_gray-3">Interview scheduled on</Text>
                    <Text>11/08/2019 11:30 AM (EST)</Text>
                  </div>
                </Col>
              </Row>
              <Row
                style={{ padding: "1em", borderTop: "1px solid #D9D9D9" }}
                type="flex"
                justify="space-between"
              >
                <Col>
                  <Button
                    className="link_button"
                    type="primary"
                    ghost
                    style={{ width: "auto", margin: "0.5em" }}
                    onClick={this.showModal}
                  >
                    See Availability
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="link_button"
                    type="primary"
                    style={{ width: "auto", margin: "0.5em" }}
                    onClick={this.showConfirm}
                  >
                    Enter Screener
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
