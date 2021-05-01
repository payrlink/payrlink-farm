/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import {
  Row,
  Col,
  Collapse,
  Typography,
  Breadcrumb,
  Input,
  Form,
  Select,
  Button,
  notification,
  Modal,
  DatePicker,
  Spin,
} from "antd";
import { Link } from "react-router-dom";
import {
  APIRequest,
  API_EDIT_PROFILE,
  API_TIME_ZONE,
  API_UPDATE_PROFILE,
  API_ADOBE_SIGN_RESPONSE,
  API_HOME,
} from "../api";
import EditStepperData from "../components/profile/EditStepperData";
import { connect } from "react-redux";
import moment from "moment";

const { Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const { MonthPicker } = DatePicker;

class EditAccount extends Component {
  state = {
    value: 1,
    confirmDirty: false,
    first_name: "",
    last_name: "",
    email_address: "",
    payment: 0,
    timezoneList: [],
    userTaxFrom: null,
  };
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handlePaymentChange = (value) => {
    this.setState({ payment: value });
  };

  clearValue = () => {
    this.setState({
      time: null,
    });
  };

  disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf("day");
  }

  // disabledDate(current) {
  //   // Can not select days after today and today
  //   return current && current.valueOf("year") > Date.now();
  // }

  handleOpenChange = (status) => {
    if (status) {
      this.setState({ isopen: true });
    } else {
      this.setState({ isopen: false });
    }
  };

  handlePanelChange = (value) => {
    const { form } = this.props;

    this.setState(
      {
        selectedyear: value,
        isopen: false,
      },
      () => {
        form.setFieldsValue({
          "[fixed_field]experience_year": value.utc(),
        });
      }
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const finalObject = values;

        function toFormData(obj, form, namespace) {
          let fd = form || new FormData();
          let formKey;

          for (let property in obj) {
            if (obj.hasOwnProperty(property) && obj[property]) {
              if (namespace) {
                formKey = namespace + "[" + property + "]";
              } else {
                formKey = property;
              }

              // if the property is an object, but not a File, use recursivity.
              if (obj[property] instanceof Date) {
                fd.append(formKey, obj[property].toISOString());
              } else if (
                typeof obj[property] === "object" &&
                !(obj[property] instanceof File)
              ) {
                toFormData(obj[property], fd, formKey);
              } else {
                // if it's a string or a File object
                fd.append(formKey, obj[property]);
              }
            }
          }
          return fd;
        }

        let finalArares = new APIRequest.Builder()
          .post()
          .setReqId(API_UPDATE_PROFILE);

        finalArares
          .reqURL("/edit-profile")
          .setParams(toFormData(finalObject))
          .response(this.onResponse)
          .error(this.onError)
          .build()
          .doRequest();
      } else {
        notification.error({
          message: "Please fill all the fields with Appropriate data.",
        });
      }
    });
  };

  componentDidMount() {
    new APIRequest.Builder()
      .get()
      .setReqId(API_EDIT_PROFILE)
      .reqURL("/edit-profile")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();

    new APIRequest.Builder()
      .get()
      .setReqId(API_ADOBE_SIGN_RESPONSE)
      .reqURL("/user-tax-form")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();

    new APIRequest.Builder()
      .get()
      .setReqId(API_HOME)
      .reqURL("/study-list")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();

    this.setState({
      first_name: this.props.user.first_name,
      last_name: this.props.user.last_name,
    });
  }

  onResponse = (response, reqId) => {
    switch (reqId) {
      case API_EDIT_PROFILE:
        this.setState(
          {
            fixQuestion:
              response.data.steps_questions_list[0].fixed_questions_list,
            stepperQuestion: response.data.steps_questions_list,
            timezoneList: response.data.timezones,
            speciality: response.data.domains,
            payment:
              response.data.steps_questions_list[0].fixed_questions_list
                .payment_preference.id,
          },
          () => {
            this.setState({
              selectedyear: this.state.fixQuestion.experience_year,
            });
          }
        );
        break;

      case API_TIME_ZONE:
        this.setState({
          timezoneList: response.data.timezone,
        });
        break;

      case API_ADOBE_SIGN_RESPONSE:
        this.setState({
          userTaxFrom: response.data.userTaxFrom,
        });
        break;

      case API_HOME:
        response.data &&
          this.setState({
            honorariaRecived: response.data.honorariaRecived,
          });
        break;

      case API_UPDATE_PROFILE:
        Modal.info({
          title: "Thank you!",
          centered: "true",
          icon: "none",
          content: (
            <p>
              Your profile is updated & the changes will be reflected after
              admin's approval.
            </p>
          ),
          maskClosable: "true",
          width: "350px",
          maskStyle: { backgroundColor: "rgba(0, 39, 102, 0.7)" },
          className: "info_modal",
          // onOk() {}
          onOk: () => {
            this.props.history.push("/my-account");
            window.scrollTo(0, 0);
          },
        });
        break;

      default:
        break;
    }
  };

  onError = (response, reqId) => {
    switch (reqId) {
      case API_EDIT_PROFILE:
        notification.error({
          message: response.meta.message,
        });
        break;

      case API_TIME_ZONE:
        notification.error({
          message: response.meta.message,
        });
        break;

      case API_UPDATE_PROFILE:
        notification.error({
          message: response.meta.message,
        });
        break;

      case API_ADOBE_SIGN_RESPONSE:
        notification.error({
          message: response.meta.message,
        });
        break;

      default:
        break;
    }
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const {
      fixQuestion,
      stepperQuestion,
      timezoneList,
      speciality,
      first_name,
      last_name,
      userTaxFrom,
      honorariaRecived,
    } = this.state;

    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    return (
      <div className="edit-profile">
        <Helmet>
          <title>Edit Account</title>
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
            <Form onSubmit={this.handleSubmit} hideRequiredMark>
              <Row
                type="flex"
                justify="center"
                align="middle"
                style={{
                  borderBottom: "1px solid #D9D9D9",
                  padding: "1em 0",
                  margin: "0 0 2em",
                }}
              >
                <Col span={12}>
                  <Text className="text_app_color text_semibold text_large">
                    Edit Account
                  </Text>
                </Col>
                <Col span={12}>
                  <Breadcrumb style={{ float: "right" }}>
                    <Breadcrumb.Item>
                      <Link to="/my-account"> My account </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Edit Profile</Breadcrumb.Item>
                  </Breadcrumb>
                </Col>
              </Row>

              {this.state.fixQuestion && this.state.stepperQuestion ? (
                <>
                  <Collapse defaultActiveKey={[1]}>
                    <Panel header="Personal Information" key="1">
                      <Row gutter={16}>
                        <Col
                          className="gutter-row"
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          md={{ span: 12 }}
                          lg={{ span: 12 }}
                        >
                          <Form.Item label="First Name">
                            {getFieldDecorator("[1][fixed_field]firstname", {
                              initialValue:
                                fixQuestion &&
                                fixQuestion.first_name &&
                                fixQuestion.first_name,
                              rules: [
                                {
                                  required: true,
                                  message: "This Field is Required!",
                                },
                                {
                                  max: 18,
                                  message:
                                    "The First Name may not be greater than 18 characters.",
                                },
                              ],
                            })(
                              <Input
                                className="field_custome_hight"
                                placeholder="Enter First Name"
                                style={{ textTransform: "capitalize" }}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col
                          className="gutter-row"
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          md={{ span: 12 }}
                          lg={{ span: 12 }}
                        >
                          <Form.Item label="Last Name">
                            {getFieldDecorator("[1][fixed_field]lastname", {
                              initialValue:
                                fixQuestion &&
                                fixQuestion.last_name &&
                                fixQuestion.last_name,
                              rules: [
                                {
                                  required: true,
                                  message: "This Field is Required!",
                                },
                                {
                                  max: 18,
                                  message:
                                    "The Last Name may not be greater than 18 characters.",
                                },
                              ],
                            })(
                              <Input
                                className="field_custome_hight"
                                placeholder="Enter Last Name"
                                style={{ textTransform: "capitalize" }}
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col
                          className="gutter-row"
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          md={{ span: 12 }}
                          lg={{ span: 12 }}
                        >
                          <Form.Item label="Email Address">
                            {getFieldDecorator("[1][fixed_field]email", {
                              initialValue:
                                fixQuestion &&
                                fixQuestion.email &&
                                fixQuestion.email,
                              rules: [
                                {
                                  required: true,
                                  message: "This Field is Required!",
                                },
                                {
                                  type: "email",
                                  message:
                                    "The input is not valid E-mail Address!",
                                },
                              ],
                            })(
                              <Input
                                disabled
                                className="field_custome_hight"
                                placeholder="Enter Email Address"
                                style={{ textTransform: "lowercase" }}
                              />
                            )}
                          </Form.Item>
                        </Col>

                        <Col
                          className="gutter-row"
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          md={{ span: 12 }}
                          lg={{ span: 12 }}
                        >
                          <Form.Item label="Time zone">
                            {getFieldDecorator("[1][fixed_field]timezone", {
                              initialValue:
                                fixQuestion &&
                                fixQuestion.user_timezone &&
                                fixQuestion.user_timezone.id,
                              rules: [
                                {
                                  required: true,
                                  message: "This Field is Required!",
                                },
                              ],
                            })(
                              <Select
                                className="field_custome_hight"
                                showSearch
                                placeholder="Select Timezone"
                                optionFilterProp="children"
                              >
                                {timezoneList.map((tz) => (
                                  <Option value={tz.id}>{tz.name}</Option>
                                ))}
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>

                      {fixQuestion && fixQuestion.user_domain && (
                        <Row gutter={16}>
                          <Col
                            className="gutter-row"
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 12 }}
                            lg={{ span: 12 }}
                          >
                            <Form.Item
                              label="What is your primary medical specialty?"
                              labelCol={{ span: "24" }}
                            >
                              {console.log(fixQuestion.user_domain)}

                              {getFieldDecorator("[1][fixed_field]specialty", {
                                initialValue: fixQuestion.user_domain.id,
                                rules: [
                                  {
                                    required: true,
                                    message: "This Field is Required!",
                                  },
                                ],
                              })(
                                <Select
                                  disabled
                                  className="field_custome_hight"
                                  showSearch
                                  placeholder="Select Speciality"
                                  optionFilterProp="children"
                                >
                                  {speciality &&
                                    speciality.map((sep) => (
                                      <Option value={sep.id}>{sep.name}</Option>
                                    ))}
                                </Select>
                              )}
                            </Form.Item>
                          </Col>
                          <Col
                            className="gutter-row"
                            xs={{ span: 24 }}
                            md={{ span: 12 }}
                            sm={{ span: 24 }}
                            lg={{ span: 12 }}
                          >
                            <Form.Item
                              label="What is your sub-specialty?"
                              labelCol={{ span: "24" }}
                            >
                              {getFieldDecorator(
                                "[1][fixed_field]sub_specialty",
                                {
                                  initialValue:
                                    fixQuestion &&
                                    fixQuestion.sub_domain &&
                                    fixQuestion.sub_domain,
                                  rules: [
                                    {
                                      required: true,
                                      message: "This Field is Required!",
                                    },
                                  ],
                                }
                              )(
                                <Input
                                  className="field_custome_hight"
                                  placeholder="Enter sub speciality"
                                  style={{ textTransform: "capitalize" }}
                                />
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      )}

                      <Row gutter={16}>
                        <Col
                          className="gutter-row"
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          md={{ span: 12 }}
                          lg={{ span: 12 }}
                        >
                          <Form.Item label="Phone Number">
                            {getFieldDecorator("[1][fixed_field]phoneno", {
                              initialValue:
                                fixQuestion &&
                                fixQuestion.phone_no &&
                                fixQuestion.phone_no.substring(2),
                              rules: [
                                {
                                  required: true,
                                  message: "This Field is Required!",
                                },
                                {
                                  pattern: /^[0-9]*$/,
                                  message:
                                    "The Phone Number should accepts only digits.",
                                },
                                {
                                  min: 8,
                                  message:
                                    "The Phone Number should be more than 8 digits.",
                                },
                                {
                                  max: 10,
                                  message:
                                    "The Phone Number should be less than 10 digits.",
                                },
                              ],
                            })(
                              <Input
                                addonBefore="+1"
                                type="tel"
                                className="field_custome_hight"
                                placeholder="Enter Phone Number"
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col
                          className="gutter-row"
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          md={{ span: 12 }}
                          lg={{ span: 12 }}
                        >
                          <Form.Item label="Payment Preference">
                            {getFieldDecorator(
                              "[1][fixed_field]Payment_preference",
                              {
                                initialValue:
                                  fixQuestion &&
                                  fixQuestion.payment_preference &&
                                  fixQuestion.payment_preference.id,
                                rules: [
                                  {
                                    required: true,
                                    message: "This Field is Required!",
                                  },
                                ],
                              }
                            )(
                              <Select
                                className="field_custome_hight"
                                showSearch
                                placeholder="Select Payment Preference"
                                optionFilterProp="children"
                                onChange={this.handlePaymentChange}
                              >
                                <Option value={1}>Standard Check</Option>
                                <Option value={2}>Paypal</Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      {this.state.payment === 1 ? (
                        <div>
                          <Row gutter={16}>
                            <Col
                              className="gutter-row"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 12 }}
                              lg={{ span: 12 }}
                            >
                              <Form.Item label="First Name">
                                {getFieldDecorator(
                                  "[1][fixed_field]bank_firstname",
                                  {
                                    initialValue:
                                      fixQuestion.bank_details &&
                                      fixQuestion.bank_details.first_name,
                                    rules: [
                                      {
                                        required: true,
                                        message: "This Field is Required!",
                                      },
                                    ],
                                  }
                                )(
                                  <Input
                                    className="field_custome_hight"
                                    placeholder="Enter First Name"
                                  />
                                )}
                              </Form.Item>
                            </Col>
                            <Col
                              className="gutter-row"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 12 }}
                              lg={{ span: 12 }}
                            >
                              <Form.Item label="Last Name">
                                {getFieldDecorator(
                                  "[1][fixed_field]bank_lastname",
                                  {
                                    initialValue:
                                      fixQuestion.bank_details &&
                                      fixQuestion.bank_details.last_name,
                                    rules: [
                                      {
                                        required: true,
                                        message: "This Field is Required!",
                                      },
                                    ],
                                  }
                                )(
                                  <Input
                                    className="field_custome_hight"
                                    placeholder="Enter Last Name"
                                  />
                                )}
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col
                              className="gutter-row"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 12 }}
                              lg={{ span: 12 }}
                            >
                              <Form.Item label="Street Address">
                                {getFieldDecorator(
                                  "[1][fixed_field]bank_streetaddress",
                                  {
                                    initialValue:
                                      fixQuestion.bank_details &&
                                      fixQuestion.bank_details.address,
                                    rules: [
                                      {
                                        required: true,
                                        message: "This Field is Required!",
                                      },
                                    ],
                                  }
                                )(
                                  <Input
                                    className="field_custome_hight"
                                    placeholder="Enter Street Address"
                                  />
                                )}
                              </Form.Item>
                            </Col>
                            <Col
                              className="gutter-row"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 12 }}
                              lg={{ span: 12 }}
                            >
                              <Form.Item label="APT/ Unit no.">
                                {getFieldDecorator("[1][fixed_field]bank_apt", {
                                  initialValue:
                                    fixQuestion.bank_details &&
                                    fixQuestion.bank_details.unit_no,
                                  rules: [{ required: false }],
                                })(
                                  <Input
                                    className="field_custome_hight"
                                    placeholder="Enter APT/ Unit no."
                                  />
                                )}
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col
                              className="gutter-row"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 12 }}
                              lg={{ span: 12 }}
                            >
                              <Form.Item label="Zip Code">
                                {getFieldDecorator(
                                  "[1][fixed_field]bank_zipcode",
                                  {
                                    initialValue:
                                      fixQuestion.bank_details &&
                                      fixQuestion.bank_details.zipcode,
                                    rules: [
                                      {
                                        required: true,
                                        message: "This Field is Required!",
                                      },
                                    ],
                                  }
                                )(
                                  <Input
                                    className="field_custome_hight"
                                    placeholder="Enter Zip Code"
                                  />
                                )}
                              </Form.Item>
                            </Col>
                            <Col
                              className="gutter-row"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 12 }}
                              lg={{ span: 12 }}
                            >
                              <Form.Item label="City">
                                {getFieldDecorator(
                                  "[1][fixed_field]bank_city",
                                  {
                                    initialValue:
                                      fixQuestion.bank_details &&
                                      fixQuestion.bank_details.city,
                                    rules: [
                                      {
                                        required: true,
                                        message: "This Field is Required!",
                                      },
                                    ],
                                  }
                                )(
                                  <Input
                                    className="field_custome_hight"
                                    placeholder="Enter City"
                                  />
                                )}
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col
                              className="gutter-row"
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 12 }}
                              lg={{ span: 12 }}
                            >
                              <Form.Item label="State">
                                {getFieldDecorator(
                                  "[1][fixed_field]bank_state",
                                  {
                                    initialValue:
                                      fixQuestion.bank_details &&
                                      fixQuestion.bank_details.state,
                                    rules: [
                                      {
                                        required: true,
                                        message: "This Field is Required!",
                                      },
                                    ],
                                  }
                                )(
                                  <Input
                                    className="field_custome_hight"
                                    placeholder="Enter State"
                                  />
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      ) : null}

                      {this.state.payment === 2 ? (
                        <Row gutter={16}>
                          <Col
                            className="gutter-row"
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 12 }}
                            lg={{ span: 12 }}
                          >
                            <Form.Item label="Paypal Email Address">
                              {getFieldDecorator(
                                "[1][fixed_field]paypal_email",
                                {
                                  initialValue:
                                    fixQuestion.bank_details &&
                                    fixQuestion.bank_details.paypal_email,
                                  rules: [
                                    {
                                      type: "email",
                                      message:
                                        "The input is not valid E-mail Address!",
                                    },
                                    {
                                      required: false,
                                      message: "This Field is Required!",
                                    },
                                    // {
                                    //   validator: this.checkRequire
                                    // }
                                  ],
                                }
                              )(
                                <Input
                                  onChange={this.onChangepaypal}
                                  className="field_custome_hight"
                                  placeholder="Enter Paypal Email Address"
                                />
                              )}
                            </Form.Item>
                          </Col>
                          <Col
                            className="gutter-row"
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 12 }}
                            lg={{ span: 12 }}
                          >
                            <Form.Item label="Paypal ID">
                              {getFieldDecorator("[1][fixed_field]paypal_id", {
                                initialValue:
                                  fixQuestion.bank_details &&
                                  fixQuestion.bank_details.paypal_id,
                                rules: [
                                  {
                                    required: false,
                                    message: "This Field is Required!",
                                  },
                                ],
                              })(
                                <Input
                                  onChange={this.onChangepaypal}
                                  className="field_custome_hight"
                                  placeholder="Enter Paypal ID"
                                />
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      ) : null}

                      <Row>
                        <Col className="gutter-row" span={24}>
                          <Form.Item
                            labelCol={{ span: 24 }}
                            label="For approximately which year have you been in clinical practice since completing your medical training, residency or fellowship?"
                          >
                            {getFieldDecorator(
                              "[1][fixed_field]experience_year",
                              {
                                initialValue: moment(this.state.selectedyear),
                                rules: [
                                  {
                                    required: true,
                                    message: "This Field is Required!",
                                  },
                                ],
                              }
                            )(
                              // <DatePicker
                              //   open={this.state.isopen}
                              //   mode="year"
                              //   format="YYYY"
                              //   onOpenChange={this.handleOpenChange}
                              //   onPanelChange={this.handlePanelChange}
                              //   onChange={this.clearValue}
                              //   placeholder="select year"
                              //   disabledDate={this.disabledDate}
                              // />
                              <MonthPicker
                                disabledDate={this.disabledDate}
                                placeholder="Select month"
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={24}>
                          {stepperQuestion && (
                            <EditStepperData
                              QueData={stepperQuestion[0]}
                              form={this.props.form}
                              step_id={1}
                            />
                          )}
                        </Col>
                      </Row>
                    </Panel>
                  </Collapse>

                  <Collapse defaultActiveKey={[1]}>
                    <Panel header="Professional Information" key="1">
                      <Row gutter={16}>
                        <Col className="gutter-row" span={24}>
                          {stepperQuestion && (
                            <EditStepperData
                              QueData={stepperQuestion[1]}
                              form={this.props.form}
                              step_id={2}
                            />
                          )}
                        </Col>
                      </Row>
                    </Panel>
                  </Collapse>

                  <Collapse defaultActiveKey={[1]}>
                    <Panel header="Patient Care Information" key="1">
                      <Row gutter={16}>
                        <Col className="gutter-row" span={24}>
                          {stepperQuestion && (
                            <EditStepperData
                              QueData={stepperQuestion[2]}
                              form={this.props.form}
                              step_id={3}
                            />
                          )}
                        </Col>
                      </Row>
                    </Panel>
                  </Collapse>

                  <Collapse defaultActiveKey={[1]}>
                    <Panel header="Additional Information" key="1">
                      <Row gutter={16}>
                        <Col className="gutter-row" span={24}>
                          {stepperQuestion && (
                            <EditStepperData
                              QueData={stepperQuestion[3]}
                              form={this.props.form}
                              step_id={4}
                            />
                          )}
                        </Col>
                      </Row>
                    </Panel>
                  </Collapse>

                  {honorariaRecived > 600 ? (
                    <Collapse defaultActiveKey={[1]}>
                      <Panel header="Payment Information" key="1">
                        <Row
                          gutter={[16, 16]}
                          type="flex"
                          align="middle"
                          style={{ marginBottom: "10px" }}
                        >
                          {userTaxFrom === null ? (
                            <>
                              <Col
                                className="gutter-row"
                                xs={{ span: 22 }}
                                sm={{ span: 22 }}
                                md={{ span: 22 }}
                                lg={{ span: 6 }}
                              >
                                Payment Information
                              </Col>
                              <Col
                                xs={{ span: 22 }}
                                sm={{ span: 22 }}
                                md={{ span: 22 }}
                                lg={{ span: 4 }}
                              >
                                <Button
                                  type="primary"
                                  className="link_button bg-blue"
                                >
                                  <a
                                    target="_blank"
                                    href={`https://secure.na2.echosign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhBivSNwaYV-Cutu8ywMrnjqjn1-K3f_xQ15761PE6wRXAPXfYXGNw1PNmLIbrjD0Qs*#name=${first_name} ${last_name}`.replace(
                                      " ",
                                      "+"
                                    )}
                                  >
                                    W9 Tax Form
                                  </a>
                                </Button>
                              </Col>
                            </>
                          ) : (
                            <>
                              <Col
                                className="gutter-row"
                                xs={{ span: 22 }}
                                sm={{ span: 22 }}
                                md={{ span: 22 }}
                                lg={{ span: 8 }}
                              >
                                You Submitted your W9 Tax form
                              </Col>
                              <Col
                                xs={{ span: 22 }}
                                sm={{ span: 22 }}
                                md={{ span: 22 }}
                                lg={{ span: 4 }}
                              >
                                <Button
                                  type="primary"
                                  className="link_button bg-blue"
                                >
                                  <a href={userTaxFrom.agreement_link}>
                                    view W9 Tax Form
                                  </a>
                                </Button>
                              </Col>
                            </>
                          )}
                        </Row>
                      </Panel>
                    </Collapse>
                  ) : null}

                  <Row gutter={16} type="flex" justify="end">
                    <Col>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginBottom: "10px" }}
                        className="link_button bg-blue"
                      >
                        Save Changes
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="default"
                        style={{ marginBottom: "10px" }}
                        className="link_button bg-white"
                        onClick={() => {
                          this.props.history.push("/my-account");
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
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
            </Form>
          </Col>
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
export default Form.create()(connect(mapStateToProps)(EditAccount));
