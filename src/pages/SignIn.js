import React, { Component } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  notification
} from "antd";
import { Link, Redirect } from "react-router-dom";
import Logo from "../assets/images/BPRG_WhiteLogo.svg";
import SignInBg from "../assets/images/SignIn_background.jpg";
import { setToken, setUser } from "../redux/action";
import { APIRequest, API_LOGIN_SUBMIT } from "../api";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

const { Text } = Typography;

export class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        new APIRequest.Builder()
          .post()
          .setReqId(API_LOGIN_SUBMIT)
          .jsonParams({
            email: values.email,
            password: values.password
          })
          .reqURL("/login")
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
      case API_LOGIN_SUBMIT:
        notification.success({
          message: response.meta.message
        });
        this.setState(
          {
            message: response.meta.message,
            isLogin: true
          },
          () => {
            this.props.setUser(response.data.user);
            this.props.setToken(response.data.token);
            this.props.history.push("/home");
          }
        );

        break;
      default:
        break;
    }
  };

  componentWillMount() {
    this.props.user !== null
      ? this.setState({
          isLogin: true
        })
      : this.setState({
          isLogin: false
        });
  }
  
  onError = (response, reqId) => {
    // this._hideLoader();
    switch (reqId) {
      case API_LOGIN_SUBMIT:
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
    return this.state.isLogin ? (
      <Redirect to="/home" />
    ) : (
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
        <Helmet>
          <title>Sign In</title>
        </Helmet>
        <Col
          xs={{ span: "22", pull: "1" }}
          sm={{ span: "20", pull: "2" }}
          lg={{ span: "12", pull: "2" }}
          xl={{ span: "6", pull: "2" }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={Logo}
              style={{
                height: "65px",
                marginBottom: "2em"
              }}
              alt="logo"
            />
          </div>
          <div className="sign_in_box">
            <Text strong>
              <h4 className="text_app_color_light">LOG IN</h4>
            </Text>
            <hr
              className="custom_line gray short"
              style={{ marginBottom: "24px" }}
            />
            <Form onSubmit={this.handleSubmit} className="login_form">
              <Form.Item
                style={{ marginBottom: "5px" }}
                className="custome_icon_class"
              >
                {getFieldDecorator("email", {
                  rules: [
                    {
                      type: "email",
                      message: "The input is not valid E-mail Address!"
                    },
                    {
                      required: true,
                      message: "Please input your E-mail Address!"
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
              <Form.Item
                style={{ marginBottom: "5px" }}
                className="default_input custome_icon_class"
              >
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: "Please input your Password!" }
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
                    type="password"
                    placeholder="Password"
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Row type="flex" justify="space-between">
                  <Col>
                    {getFieldDecorator("remember", {
                      valuePropName: "checked",
                      initialValue: true
                    })(<Checkbox>Remember Me</Checkbox>)}
                  </Col>
                  <Col>
                    <Link
                      className="login-form-forgot"
                      to="/forgot-password"
                      style={{ marginLeft: "auto" }}
                    >
                      Forgot Password?
                    </Link>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  block
                >
                  LOG IN
                </Button>
              </Form.Item>
              <div style={{ display: "flex", justifyContent: "center" }}>
                Don't have an account?{" "}
                <Text strong>
                  <Link to="/register">&nbsp;REGISTER</Link>
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
              Copyright <span className="text_normal">&copy;</span>{" "}
              {new Date().getFullYear()} by BluePrint Research Group
            </Text>
          </div>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    token: state.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setToken: token => dispatch(setToken(token)),
    setUser: user => dispatch(setUser(user))
  };
};

// export default connect({
//   mapStateToProps
// })(Form.create()(SignIn));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(SignIn));

// export default WrappedNormalLoginForm;
