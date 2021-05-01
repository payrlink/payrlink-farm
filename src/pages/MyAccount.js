/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import {
  Row,
  Col,
  Collapse,
  Input,
  Form,
  Typography,
  Button,
  Modal,
  notification,
  Spin,
} from "antd";
import StepperData from "../components/profile/StepperData";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import { Link } from "react-router-dom";
import { APIRequest, API_CHANGE_PASSWORD, API_VIEW_PROFILE } from "../api";
import moment from "moment";
import { connect } from "react-redux";

const { Text } = Typography;
const { Panel } = Collapse;

export class MyAccount extends Component {
  state = {
    visible: false,
    oldPass: null,
    newPass: null,
    confPass: null,
    fixQuestion: [],
    stepperQuestion: [],
    first_name: null,
    last_name: null,
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.changePassword();
      }
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  experienceDiff = (e) => {
    var difference = 0;
    var differenceTemp = moment().diff(moment(e), "year");

    if (differenceTemp === 0) {
      difference = moment().diff(moment(e), "month") + ' Months';
    } else {
      difference = differenceTemp + ' Years';
    }
    return difference;
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("new")) {
      callback("The password and confirm password must match.");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  changePassword = () => {
    new APIRequest.Builder()
      .post()
      .setReqId(API_CHANGE_PASSWORD)
      .reqURL("/change-password")
      .jsonParams({
        old_password: this.state.oldPass,
        password: this.state.newPass,
        confirm_password: this.state.confPass,
      })
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
  };

  componentDidMount() {
    new APIRequest.Builder()
      .get()
      .setReqId(API_VIEW_PROFILE)
      .reqURL("/view-profile")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();

    this.props.user &&
      this.setState({
        first_name: this.props.user.first_name,
        last_name: this.props.user.last_name,
      });
  }

  onResponse = (response, reqId) => {
    switch (reqId) {
      case API_CHANGE_PASSWORD:
        this.setState({
          visible: false,
        });
        notification.success({
          message: response.meta.message,
        });
        break;

      case API_VIEW_PROFILE:
        this.setState({
          fixQuestion:
            response.data.steps_questions_list[0].fixed_questions_list,
          stepperQuestion: response.data.steps_questions_list,
          addData: response.data,
        });
        break;

      default:
        break;
    }
  };

  onError = (response, reqId) => {
    switch (reqId) {
      case API_CHANGE_PASSWORD:
        notification.error({
          message: response.meta.message,
        });
        break;

      case API_VIEW_PROFILE:
        // notification.error({
        //   message: response.meta.message
        // });
        break;
      default:
        break;
    }
  };

  render() {
    const { fixQuestion, stepperQuestion, first_name, last_name } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className="view-profile">
        <Helmet>
          <title>My Account</title>
        </Helmet>
        <Header />
        <Row
          type="flex"
          justify="center"
          className="container_padding min-height-cal-regular"
        >
          <Col
            xs={{ span: 22 }}
            sm={{ span: 22 }}
            md={{ span: 22 }}
            lg={{ span: 18 }}
          >
            <Row
              type="flex"
              justify="center"
              style={{
                borderBottom: "1px solid #D9D9D9",
                padding: "1em 0",
              }}
            >
              <Col span={24}>
                <Text className="text_app_color text_semibold text_large">
                  My Account
                </Text>
              </Col>
            </Row>
            <Row
              type="flex"
              justify="end"
              gutter={16}
              style={{
                padding: "1.5em 0",
              }}
            >
              <Col style={{ marginBottom: "10px" }}>
                <Button
                  className="link_button bg-white"
                  onClick={this.showModal}
                >
                  Change password
                </Button>
              </Col>
              <Col style={{ marginBottom: "10px" }}>
                <Link to="/edit-account">
                  <Button type="primary" className="link_button bg-blue">
                    Edit Profile
                  </Button>
                </Link>
              </Col>
            </Row>
            <Modal
              title="Change password"
              centered
              maskStyle={{ backgroundColor: "rgba(0, 39, 102, 0.7)" }}
              visible={this.state.visible}
              onCancel={this.handleCancel}
              className="change-password"
            >
              <Form onSubmit={this.handleSubmit} hideRequiredMark>
                <Form.Item label="Current Password">
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "This Field is Required!",
                      },
                    ],
                  })(
                    <Input.Password
                      placeholder="Enter Current Password"
                      onChange={(e) => {
                        this.setState({
                          oldPass: e.target.value,
                        });
                      }}
                    />
                  )}
                </Form.Item>
                <Form.Item label="New Password">
                  {getFieldDecorator("new", {
                    rules: [
                      {
                        required: true,
                        message: "This Field is Required!",
                      },
                      {
                        validator: this.validateToNextPassword,
                      },
                      {
                        pattern: /^(?=.*\d)(?=.*[0-9])(?=.*[a-zA-Z]).{8,}/,
                        message:
                          "The password should be 8 characters atleast and should have atleast one number.",
                      },
                    ],
                  })(
                    <Input.Password
                      placeholder="Enter New Password"
                      onChange={(e) => {
                        this.setState({
                          newPass: e.target.value,
                        });
                      }}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Confirm Password:">
                  {getFieldDecorator("confirm", {
                    rules: [
                      {
                        required: true,
                        message: "This Field is Required!",
                      },
                      {
                        validator: this.compareToFirstPassword,
                      },
                    ],
                  })(
                    <Input.Password
                      placeholder="Enter New Password Again"
                      onChange={(e) => {
                        this.setState({
                          confPass: e.target.value,
                        });
                      }}
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  <Button
                    type="submit"
                    className="float-right"
                    onClick={this.handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    htmlType="submit"
                    className="float-right"
                    style={{ marginRight: "15px" }}
                  >
                    Update Password
                  </Button>
                </Form.Item>
              </Form>
            </Modal>

            {this.state.addData ? (
              <>
                <Collapse defaultActiveKey={[1]}>
                  <Panel header="Personal Information" key="1">
                    <Row gutter={8}>
                      <Col
                        className="gutter-row mb-2"
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 6 }}
                      >
                        <div className="gutter-box">
                          <p className="text_gray-4 text-capitalize">
                            First Name:
                          </p>
                          <p
                            className="text_gray-3"
                            style={{ textTransform: "capitalize" }}
                          >
                            {fixQuestion.first_name}
                          </p>
                        </div>
                      </Col>
                      <Col
                        className="gutter-row mb-2"
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 6 }}
                      >
                        <div className="gutter-box">
                          <p className="text_gray-4 text-capitalize">
                            Last Name:
                          </p>
                          <p
                            className="text_gray-3"
                            style={{ textTransform: "capitalize" }}
                          >
                            {fixQuestion.last_name}
                          </p>
                        </div>
                      </Col>
                      <Col
                        className="gutter-row mb-2"
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 6 }}
                      >
                        <div className="gutter-box">
                          <p className="text_gray-4 text-capitalize">
                            Email Address:
                          </p>
                          <p className="text_gray-3">{fixQuestion.email}</p>
                        </div>
                      </Col>
                      <Col
                        className="gutter-row mb-2"
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 6 }}
                      >
                        <div className="gutter-box">
                          <p className="text_gray-4 text-capitalize">
                            Primary Medical Specialty
                          </p>
                          <p className="text_gray-3">
                            {fixQuestion.user_domain &&
                              fixQuestion.user_domain.name}
                          </p>
                        </div>
                      </Col>
                      <Col
                        className="gutter-row mb-2"
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 6 }}
                      >
                        <div className="gutter-box">
                          <p className="text_gray-4 text-capitalize">
                            Sub Specialty
                          </p>
                          <p className="text_gray-3">
                            {fixQuestion.sub_domain}
                          </p>
                        </div>
                      </Col>
                      <Col
                        className="gutter-row mb-2"
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 6 }}
                      >
                        <div className="gutter-box">
                          <p className="text_gray-4 text-capitalize">
                            Time Zone
                          </p>
                          <p className="text_gray-3">
                            {fixQuestion.user_timezone &&
                              fixQuestion.user_timezone.name}
                          </p>
                        </div>
                      </Col>

                      <Col
                        className="gutter-row mb-2"
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 6 }}
                      >
                        <div className="gutter-box">
                          <p className="text_gray-4 text-capitalize">
                            Phone Number:
                          </p>
                          <p className="text_gray-3">{fixQuestion.phone_no}</p>
                        </div>
                      </Col>

                      <Col
                        className="gutter-row mb-2"
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 6 }}
                      >
                        <div className="gutter-box">
                          <p className="text_gray-4">
                            Tolal Years of Experience:
                          </p>
                          <p className="text_gray-3">
                            {fixQuestion?.experience_year !== null &&
                              this.experienceDiff(fixQuestion.experience_year)}
                          </p>
                        </div>
                      </Col>

                      <Col
                        className="gutter-row mb-2"
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 6 }}
                      >
                        <div className="gutter-box">
                          <p className="text_gray-4 text-capitalize">
                            Payment Preference
                          </p>
                          <p className="text_gray-3">
                            {fixQuestion.payment_preference &&
                              fixQuestion.payment_preference.name}
                          </p>
                        </div>
                      </Col>

                      {fixQuestion.payment_preference_id &&
                      fixQuestion.payment_preference_id === 1 &&
                      fixQuestion.bank_details ? (
                        <div>
                          {fixQuestion.bank_details.first_name !== null && (
                            <Col
                              className="gutter-row mb-2"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 8 }}
                              lg={{ span: 6 }}
                            >
                              <div className="gutter-box">
                                <p className="text_gray-4 text-capitalize">
                                  Bank First Name
                                </p>
                                <p className="text_gray-3">
                                  {fixQuestion.bank_details.first_name}
                                </p>
                              </div>
                            </Col>
                          )}
                          {fixQuestion.bank_details.last_name !== null && (
                            <Col
                              className="gutter-row mb-2"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 8 }}
                              lg={{ span: 6 }}
                            >
                              <div className="gutter-box">
                                <p className="text_gray-4 text-capitalize">
                                  Bank Last Name
                                </p>
                                <p className="text_gray-3">
                                  {fixQuestion.bank_details.last_name}
                                </p>
                              </div>
                            </Col>
                          )}
                          {fixQuestion.bank_details.address !== null && (
                            <Col
                              className="gutter-row mb-2"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 8 }}
                              lg={{ span: 6 }}
                            >
                              <div className="gutter-box">
                                <p className="text_gray-4 text-capitalize">
                                  Street Address
                                </p>
                                <p className="text_gray-3">
                                  {fixQuestion.bank_details.address}
                                </p>
                              </div>
                            </Col>
                          )}
                          {fixQuestion.bank_details.unit_no !== null && (
                            <Col
                              className="gutter-row mb-2"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 8 }}
                              lg={{ span: 6 }}
                            >
                              <div className="gutter-box">
                                <p className="text_gray-4 text-capitalize">
                                  APT/ Unit no.
                                </p>
                                <p className="text_gray-3">
                                  {fixQuestion.bank_details.unit_no}
                                </p>
                              </div>
                            </Col>
                          )}
                          {fixQuestion.bank_details.zipcode !== null && (
                            <Col
                              className="gutter-row mb-2"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 8 }}
                              lg={{ span: 6 }}
                            >
                              <div className="gutter-box">
                                <p className="text_gray-4 text-capitalize">
                                  Zip Code
                                </p>
                                <p className="text_gray-3">
                                  {fixQuestion.bank_details.zipcode}
                                </p>
                              </div>
                            </Col>
                          )}
                          {fixQuestion.bank_details.city !== null && (
                            <Col
                              className="gutter-row mb-2"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 8 }}
                              lg={{ span: 6 }}
                            >
                              <div className="gutter-box">
                                <p className="text_gray-4 text-capitalize">
                                  City
                                </p>
                                <p className="text_gray-3">
                                  {fixQuestion.bank_details.city}
                                </p>
                              </div>
                            </Col>
                          )}
                          {fixQuestion.bank_details.state !== null && (
                            <Col
                              className="gutter-row mb-2"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 8 }}
                              lg={{ span: 6 }}
                            >
                              <div className="gutter-box">
                                <p className="text_gray-4 text-capitalize">
                                  State
                                </p>
                                <p className="text_gray-3">
                                  {fixQuestion.bank_details.state}
                                </p>
                              </div>
                            </Col>
                          )}
                        </div>
                      ) : fixQuestion.payment_preference_id === 2 &&
                        fixQuestion.bank_details ? (
                        <>
                          {fixQuestion.bank_details.paypal_email &&
                            fixQuestion.bank_details.paypal_email !== null && (
                              <Col
                                className="gutter-row mb-2"
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 8 }}
                                lg={{ span: 6 }}
                              >
                                <div className="gutter-box">
                                  <p className="text_gray-4 text-capitalize">
                                    Paypal Email Address
                                  </p>
                                  <p className="text_gray-3">
                                    {fixQuestion.bank_details.paypal_email}
                                  </p>
                                </div>
                              </Col>
                            )}
                          {fixQuestion.bank_details.paypal_email &&
                            fixQuestion.bank_details.paypal_id !== null && (
                              <Col
                                className="gutter-row mb-2"
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 8 }}
                                lg={{ span: 6 }}
                              >
                                <div className="gutter-box">
                                  <p className="text_gray-4 text-capitalize">
                                    Paypal ID
                                  </p>
                                  <p className="text_gray-3">
                                    {fixQuestion.bank_details.paypal_id}
                                  </p>
                                </div>
                              </Col>
                            )}
                        </>
                      ) : null}
                    </Row>
                    <Row gutter={8}>
                      <StepperData QueData={stepperQuestion[0]} />
                    </Row>
                  </Panel>
                </Collapse>
                <Collapse defaultActiveKey={1}>
                  <Panel header="Professional Information" key="1">
                    <Row gutter={8}>
                      <StepperData QueData={stepperQuestion[1]} />
                    </Row>
                  </Panel>
                </Collapse>
                <Collapse defaultActiveKey={[1]}>
                  <Panel header="Patient Care Information" key="1">
                    <Row gutter={8}>
                      <StepperData QueData={stepperQuestion[2]} />
                    </Row>
                  </Panel>
                </Collapse>
                <Collapse defaultActiveKey={[1]}>
                  <Panel header="Additional Information" key="1">
                    <Row gutter={8}>
                      <StepperData QueData={stepperQuestion[3]} />
                    </Row>
                  </Panel>
                </Collapse>
              </>
            ) : (
              <div
                className="container_padding min-height-cal-regular"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin size="large" />
              </div>
            )}
          </Col>
          {/* <Col>
            <a
              target="_blank"
              href={`
https://secure.na2.echosign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhCJo9vkPs63Y0btDMfHipXonUR0It2Lccwh73OLvfVqB61rr3knSfbKAEypz0BEbLY*#name=${first_name} ${last_name}`.replace(
                " ",
                "+"
              )}
            >
              W9 Tax Form
            </a>
          </Col> */}
        </Row>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default Form.create()(connect(mapStateToProps)(MyAccount));
