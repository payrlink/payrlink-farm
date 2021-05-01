import React, { Component } from "react";
import { Typography, Form, Input, Select, DatePicker, Spin } from "antd";
import { connect } from "react-redux";
import FormData from "./FormData";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;
const { MonthPicker } = DatePicker;

class Step1 extends Component {
  state = {
    confirmDirty: false,
    first_name: "",
    last_name: "",
    email_address: "",
    paypal_req: "",
    selectedFile: null,
    selectedFileList: [],
    

    payment:
      this.props.formFields && this.props.formFields.fixed_field
        ? this.props.formFields.fixed_field.Payment_preference
        : 0
  };

  // password validation
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  // password validation
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("[fixed_field]password")) {
      callback("The password and confirm password must match.");
    } else {
      callback();
    }
  };

  componentDidMount () {
    this.props.formFields.length !== 0 && this.setState({
      user_role: this.props.formFields.fixed_field.user_role
    })
  }

  // password validation
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["[fixed_field]confirm"], { force: true });
    }
    callback();
  };

  // onChangePaypalEmail = e => {
  //   this.setState({paypal_req : e.target.value })
  // }

  // onChangePaypalId = e => {
  //   this.setState({paypal_req : e.target.value })
  // }

  // auto capitalize first name
  onChangeFirstName = e => {
    this.setState({
      first_name:
        e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
    });
  };

  // auto capitalize last name
  onChangeLastName = e => {
    this.setState({
      last_name:
        e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
    });
  };

  onChangeEmail = e => {
    this.setState({ email_address: e.target.value });
  };
  onChangePhone = e => {
    this.setState({ phoneno: e.target.value });
  };

  handlePaymentChange = value => {
    this.setState({ payment: value });
  };

  clearValue = () => {
    this.setState({
      time: null
    });
  };

  disabledDate(current) {
    // Can not select days after today and today
    // return current && current.valueOf("year") > Date.now();
    return current && current > moment().endOf("day");
  }

  handleOpenChange = status => {
    if (status) {
      this.setState({ isopen: true });
    } else {
      this.setState({ isopen: false });
    }
  };

  handlePanelChange = value => {
    const { form } = this.props;

    this.setState(
      {
        selectedyear: value,
        isopen: false
      },
      () => {
        form.setFieldsValue({
          "[fixed_field]experience_year": value.utc()
        });
      }
    );
  };

  roleChange = role_id => {
    this.setState({
      user_role: role_id
    });
    this.props.onRoleChange && this.props.onRoleChange(role_id);
  };

  render() {
    const {
      form,
      data,
      timezone,
      speciality,
      formFields,
      userRole
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        {data !== undefined ? (
          <div className="register_stepper_form">
            <Title className="text_app_color_light" level={4}>
              {data.title}
            </Title>

            <div>
              <Form.Item label="First Name">
                {getFieldDecorator("[fixed_field]firstname", {
                  initialValue:
                    formFields && formFields.fixed_field
                      ? formFields.fixed_field.firstname
                      : [],
                  rules: [
                    { required: true, message: "This Field is Required!" },
                    {
                      max: 18,
                      message:
                        "The First Name may not be greater than 18 characters."
                    },
                    { whitespace: true, message: "This Field cannot be empty" }
                  ]
                })(
                  <Input
                    onChange={this.onChangeFirstName}
                    className="field_custome_hight"
                    placeholder="Enter First Name"
                    style={{ textTransform: "capitalize" }}
                  />
                )}
              </Form.Item>
              <Form.Item label="Last Name">
                {getFieldDecorator("[fixed_field]lastname", {
                  initialValue:
                    formFields && formFields.fixed_field
                      ? formFields.fixed_field.lastname
                      : [],
                  rules: [
                    { required: true, message: "This Field is Required!" },
                    {
                      max: 18,
                      message:
                        "The Last Name may not be greater than 18 characters."
                    },
                    { whitespace: true, message: "This Field cannot be empty" }
                  ]
                })(
                  <Input
                    onChange={this.onChangeLastName}
                    className="field_custome_hight"
                    placeholder="Enter Last Name"
                    style={{ textTransform: "capitalize" }}
                  />
                )}
              </Form.Item>
              <Form.Item label="Email Address">
                {getFieldDecorator("[fixed_field]email", {
                  initialValue:
                    formFields && formFields.fixed_field
                      ? formFields.fixed_field.email
                      : [],
                  rules: [
                    {
                      required: true,
                      message: "This Field is Required!"
                    },
                    {
                      type: "email",
                      message: "The input is not valid E-mail Address!"
                    },
                    { whitespace: true, message: "This Field cannot be empty" }
                  ]
                })(
                  <Input
                    onChange={this.onChangeEmail}
                    className="field_custome_hight"
                    placeholder="Enter Email Address"
                    style={{ textTransform: "lowercase" }}
                  />
                )}
              </Form.Item>
              <Form.Item label="Password" hasFeedback>
                {getFieldDecorator("[fixed_field]password", {
                  initialValue:
                    formFields && formFields.fixed_field
                      ? formFields.fixed_field.password
                      : "",
                  rules: [
                    {
                      required: true,
                      message: "This Field is Required!"
                    },
                    {
                      validator: this.validateToNextPassword
                    },
                    {
                      pattern: /^(?=.*\d)(?=.*[0-9])(?=.*[a-zA-Z]).{8,}/,
                      message:
                        "The password should be 8 characters atleast and should have atleast one number."
                    }
                    // {
                    //   min: 8,
                    //   message: "The Password must be at least 8 characters."
                    // }
                  ]
                })(
                  <Input.Password
                    className="field_custome_hight"
                    placeholder="Enter Password"
                  />
                )}
              </Form.Item>
              <Form.Item label="Retype Password" hasFeedback>
                {getFieldDecorator("[fixed_field]confirm", {
                  initialValue:
                    formFields && formFields.fixed_field
                      ? formFields.fixed_field.confirm
                      : "",
                  rules: [
                    {
                      required: true,
                      message: "This Field is Required!"
                    },
                    {
                      validator: this.compareToFirstPassword
                    }
                  ]
                })(
                  <Input.Password
                    className="field_custome_hight"
                    onBlur={this.handleConfirmBlur}
                    placeholder="Retype Password"
                  />
                )}
              </Form.Item>

              <Form.Item label="Your Role">
                {getFieldDecorator("[fixed_field]user_role", {
                  initialValue:
                    formFields && formFields.fixed_field
                      ? formFields.fixed_field.user_role
                      : [],
                  rules: [
                    { required: true, message: "This Field is Required!" }
                  ]
                })(
                  <Select
                    className="field_custome_hight"
                    showSearch
                    placeholder="Select Role"
                    optionFilterProp="children"
                    onChange={this.roleChange}
                  >
                    {userRole &&
                      userRole.map(user_role => (
                        <Option value={user_role.id}>{user_role.name}</Option>
                      ))}
                  </Select>
                )}
              </Form.Item>

              {this.state.user_role === 3 ||
              this.state.user_role === 4 ||
              this.state.user_role === 5 ||
              this.state.user_role === 6 ? (
                <>
                  <Form.Item
                    label="What is your primary medical specialty?"
                    labelCol={{ span: "24" }}
                  >
                    {getFieldDecorator("[fixed_field]specialty", {
                      initialValue:
                        formFields && formFields.fixed_field
                          ? formFields.fixed_field.specialty
                          : [],
                      rules: [
                        { required: true, message: "This Field is Required!" }
                      ]
                    })(
                      <Select
                        className="field_custome_hight"
                        showSearch
                        placeholder="Select Speciality"
                        optionFilterProp="children"
                      >
                        {speciality.map(sep => (
                          <Option value={sep.id}>{sep.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  {this.state.user_role !== 5 && (
                    <Form.Item
                      label="What is your sub-specialty?"
                      labelCol={{ span: "24" }}
                    >
                      {getFieldDecorator("[fixed_field]sub_specialty", {
                        initialValue:
                          formFields && formFields.fixed_field
                            ? formFields.fixed_field.sub_specialty
                            : [],
                        rules: [{ required: false }]
                      })(
                        <Input
                          className="field_custome_hight"
                          placeholder="Enter sub speciality"
                          style={{ textTransform: "capitalize" }}
                        />
                      )}
                    </Form.Item>
                  )}
                </>
              ) : null}
              <Form.Item
                label="Please select the approximate month and year that you started clinical practice since completing your medical training, residency or fellowship."
                labelCol={{ span: 24 }}
              >
                {getFieldDecorator("[fixed_field]experience_year", {
                  initialValue:
                    formFields && formFields.fixed_field
                      ? formFields.fixed_field.experience_year
                      : this.state.selectedyear &&
                        moment(this.state.selectedyear),
                  rules: [
                    {
                      required: true,
                      message: "This Field is Required!"
                    }
                  ]
                })(
                  <MonthPicker
                    disabledDate={this.disabledDate}
                    placeholder="Select month"
                  />
                )}
              </Form.Item>

              <Form.Item label="Time zone">
                {getFieldDecorator("[fixed_field]timezone", {
                  initialValue:
                    formFields && formFields.fixed_field
                      ? formFields.fixed_field.timezone
                      : [],
                  rules: [
                    { required: true, message: "This Field is Required!" }
                  ]
                })(
                  <Select
                    className="field_custome_hight"
                    showSearch
                    placeholder="Select Timezone"
                    optionFilterProp="children"
                  >
                    {timezone.map(tz => (
                      <Option value={tz.id}>{tz.name}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="Payment Preference">
                {getFieldDecorator("[fixed_field]Payment_preference", {
                  initialValue:
                    formFields && formFields.fixed_field
                      ? formFields.fixed_field.Payment_preference
                      : [],
                  rules: [
                    { required: true, message: "This Field is Required!" }
                  ]
                })(
                  <Select
                    className="field_custome_hight"
                    showSearch
                    placeholder="Select Payment Preference"
                    optionFilterProp="children"
                    onChange={this.handlePaymentChange}
                  >
                    <Option value="1">Standard Check</Option>
                    <Option value="2">Paypal</Option>
                  </Select>
                )}
              </Form.Item>
              {this.state.payment === "1" ? (
                <div>
                  <Form.Item label="First Name">
                    {getFieldDecorator("[fixed_field]bank_firstname", {
                      initialValue:
                        formFields && formFields.fixed_field
                          ? formFields.fixed_field.bank_firstname
                          : this.state.first_name,
                      rules: [
                        { required: true, message: "This Field is Required!" },
                        {
                          whitespace: true,
                          message: "This Field cannot be empty"
                        }
                      ]
                    })(
                      <Input
                        className="field_custome_hight"
                        placeholder="Enter First Name"
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="Last Name">
                    {getFieldDecorator("[fixed_field]bank_lastname", {
                      initialValue:
                        formFields && formFields.fixed_field
                          ? formFields.fixed_field.bank_lastname
                          : this.state.last_name,
                      rules: [
                        { required: true, message: "This Field is Required!" },
                        {
                          whitespace: true,
                          message: "This Field cannot be empty"
                        }
                      ]
                    })(
                      <Input
                        className="field_custome_hight"
                        placeholder="Enter Last Name"
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="Street Address">
                    {getFieldDecorator("[fixed_field]bank_streetaddress", {
                      initialValue:
                        formFields && formFields.fixed_field
                          ? formFields.fixed_field.bank_streetaddress
                          : [],
                      rules: [
                        { required: true, message: "This Field is Required!" },
                        {
                          whitespace: true,
                          message: "This Field cannot be empty"
                        }
                      ]
                    })(
                      <Input
                        className="field_custome_hight"
                        placeholder="Enter Street Address"
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="APT/ Unit no.">
                    {getFieldDecorator("[fixed_field]bank_apt", {
                      initialValue:
                        formFields && formFields.fixed_field
                          ? formFields.fixed_field.bank_apt
                          : [],
                      rules: [{ required: false }]
                    })(
                      <Input
                        className="field_custome_hight"
                        placeholder="Enter APT/ Unit no."
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="Zip Code">
                    {getFieldDecorator("[fixed_field]bank_zipcode", {
                      initialValue:
                        formFields && formFields.fixed_field
                          ? formFields.fixed_field.bank_zipcode
                          : [],
                      rules: [
                        { required: true, message: "This Field is Required!" },
                        {
                          whitespace: true,
                          message: "This Field cannot be empty"
                        }
                      ]
                    })(
                      <Input
                        className="field_custome_hight"
                        placeholder="Enter Zip Code"
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="City">
                    {getFieldDecorator("[fixed_field]bank_city", {
                      initialValue:
                        formFields && formFields.fixed_field
                          ? formFields.fixed_field.bank_city
                          : [],
                      rules: [
                        { required: true, message: "This Field is Required!" },
                        {
                          whitespace: true,
                          message: "This Field cannot be empty"
                        }
                      ]
                    })(
                      <Input
                        className="field_custome_hight"
                        placeholder="Enter City"
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="State">
                    {getFieldDecorator("[fixed_field]bank_state", {
                      initialValue:
                        formFields && formFields.fixed_field
                          ? formFields.fixed_field.bank_state
                          : [],
                      rules: [
                        { required: true, message: "This Field is Required!" },
                        {
                          whitespace: true,
                          message: "This Field cannot be empty"
                        }
                      ]
                    })(
                      <Input
                        className="field_custome_hight"
                        placeholder="Enter State"
                      />
                    )}
                  </Form.Item>
                </div>
              ) : null}
              {this.state.payment === "2" ? (
                <div>
                  <Form.Item
                    label="Paypal Email Address"
                    // style={{ marginBottom: 0 }}
                  >
                    {getFieldDecorator("[fixed_field]paypal_email", {
                      initialValue:
                        formFields && formFields.fixed_field
                          ? formFields.fixed_field.paypal_email
                          : this.state.email_address,
                      rules: [
                        {
                          type: "email",
                          message: "The input is not valid E-mail Address!"
                        },
                        {
                          required: false,
                          message: "This Field is Required!"
                        }
                      ]
                    })(
                      <Input
                        onChange={this.onChangepaypal}
                        className="field_custome_hight"
                        placeholder="Enter Paypal Email Address"
                      />
                    )}
                  </Form.Item>
                  <div
                    style={{
                      borderTop: "1px solid #D9D9D9",
                      position: "relative",
                      marginBottom: "10px"
                    }}
                  >
                    <div
                      style={{
                        margin: "-10px auto 0 auto",
                        width: "100%",
                        padding: "0 5px",
                        position: "absolute"
                      }}
                      className="text_center"
                    >
                      <span className="bg_white" style={{ padding: "0 7px" }}>
                        or
                      </span>
                    </div>
                  </div>
                  <Form.Item label="Paypal ID">
                    {getFieldDecorator("[fixed_field]paypal_id", {
                      initialValue:
                        formFields && formFields.fixed_field
                          ? formFields.fixed_field.paypal_id
                          : [],
                      rules: [
                        { required: false, message: "This Field is Required!" }
                      ]
                    })(
                      <Input
                        onChange={this.onChangepaypal}
                        className="field_custome_hight"
                        placeholder="Enter Paypal ID"
                      />
                    )}
                  </Form.Item>
                </div>
              ) : null}

              <Form.Item label="Phone Number">
                {getFieldDecorator("[fixed_field]phoneno", {
                  initialValue:
                    formFields && formFields.fixed_field
                      ? formFields.fixed_field.phoneno
                      : [],
                  rules: [
                    { required: true, message: "This Field is Required!" },
                    {
                      pattern: /^[0-9]*$/,
                      message: "The Phone Number should accepts only digits."
                    },
                    {
                      min: 8,
                      message: "The Phone Number should be more than 8 digits."
                    },
                    {
                      max: 10,
                      message: "The Phone Number should be less than 10 digits."
                    }
                  ]
                })(
                  <Input
                    type="tel"
                    onChange={this.onChangePhone}
                    addonBefore="+1"
                    // type="number"
                    className="field_custome_hight"
                    placeholder="Enter Phone Number"
                  />
                )}
              </Form.Item>
            </div>

            {/* dynamic question start */}
            <FormData form={form} data={data} formFields={formFields} />
            {/* dynamic question end */}
          </div>
        ) : (
          <Spin
            className="register_stepper_form"
            size="large"
            style={{ width: "-webkit-fill-available", padding: "7em 0" }}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    formField: state.formField
  };
};

export default connect(mapStateToProps)(Step1);
