import React, { Component } from "react";
import { Row, Col, Form, Input, Button, Typography, notification } from "antd";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Logo from "../assets/images/BPRG_WhiteLogo.svg";
import SignInBg from "../assets/images/SignIn_background.jpg";
import { APIRequest, API_FORGOT_PASSWORD } from "../api";

const { Text } = Typography;

export class ForgotPassword extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        
        new APIRequest.Builder()
          .post()
          .setReqId(API_FORGOT_PASSWORD)
          .jsonParams({
            email: values.email
          })
          .reqURL("/forgot-password")
          .response(this.onResponse)
          .error(this.onError)
          .build()
          .doRequest();
        
      }
    });
  };

  onResponse = (response, reqId) => {
    // this._hideLoader();
    switch (reqId) {
      case API_FORGOT_PASSWORD:
        
        notification.success({
          message: response.meta.message
        });
        break;
      default:
        break;
    }
  };

  onError = (response, reqId) => {
    // this._hideLoader();
    switch (reqId) {
      case API_FORGOT_PASSWORD:
        notification.error({
          message: response.meta.message
        });
        break;
      default:
        break;
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Helmet>
          <title>Forgot Password</title>
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
                <h4 className="text_app_color_light">Forgot Password?</h4>
              </Text>
              <hr className="custom_line gray short" />
              <p>
                Please enter your email address below and we will send you a
                link to reset your password.
              </p>
              <Form onSubmit={this.handleSubmit} className="login_form">
                <Form.Item style={{ marginBottom: "20px" }}>
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        type: "email",
                        message: "The input is not valid E-mail!"
                      },
                      {
                        required: true,
                        message: "Please input your E-mail!"
                      }
                    ]
                  })(
                    <Input
                      className="field_custome_hight"
                      prefix={
                        <i
                          className="icon-mail text_app_color_light"
                          style={{ fontSize: "16px" }}
                        />
                      }
                      placeholder="Email Address"
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
                    SEND
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

const ForgotPasswordForm = Form.create({ name: "forgot_password" })(
  ForgotPassword
);

export default ForgotPasswordForm;
