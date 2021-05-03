import React, { Component } from "react";
import { Row, Col, Form, Input, Button, Typography } from "antd";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Logo from "../assets/images/BPRG_WhiteLogo.svg";
import SignInBg from "../assets/images/SignIn_background.jpg";

const { Text } = Typography;

export class ResetPassword extends Component {
  state = {
    confirmDirty: false
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log("Received: ", values);
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
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

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Helmet>
          <title>Reset Password</title>
        </Helmet>
        <Row
          type="flex"
          justify="end"
          align="middle"
          style={{
            minHeight: "100vh",
            backgroundImage: `url(${SignInBg})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            padding: "1em 0"
          }}
        >
          <Col
            xs={{ span: "22", pull: "1" }}
            sm={{ span: "20", pull: "2" }}
            lg={{ span: "12", pull: "2" }}
            xl={{ span: "6", pull: "2" }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={Logo}
                style={{ height: "65px", marginBottom: "2em" }}
                alt="logo"
              />
            </div>
            <div className="sign_in_box">
              <Text strong>
                <h4 className="text_app_color_light">Reset Password?</h4>
              </Text>
              <hr className="custom_line gray short" />

              <Form onSubmit={this.handleSubmit} className="login_form">
                <Form.Item style={{ marginBottom: "5px" }} hasFeedback>
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "This Field is Required!"
                      },
                      {
                        validator: this.validateToNextPassword
                      }
                    ]
                  })(
                    <Input.Password
                      className="field_custome_hight"
                      prefix={
                        <i
                          className="icon-lock text_app_color_light"
                          style={{ fontSize: "16px" }}
                        />
                      }
                      placeholder="Enter New Password"
                    />
                  )}
                </Form.Item>
                <Form.Item style={{ marginBottom: "20px" }} hasFeedback>
                  {getFieldDecorator("confirm", {
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
                      prefix={
                        <i
                          className="icon-lock text_app_color_light"
                          style={{ fontSize: "16px" }}
                        />
                      }
                      placeholder="Retype New Password"
                    />
                  )}
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    block
                  >
                    RESET
                  </Button>
                </Form.Item>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  Know Your Password?{" "}
                  <Text strong>
                    <Link to="/sign_in">&nbsp;LOG IN</Link>
                  </Text>
                </div>
              </Form>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1em"
              }}
            >
              <Text className="text_white text_small">
                Copyright <span className="text_normal">&copy;</span> {new Date().getFullYear()} by BluePrint Research Group
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(ResetPassword);
