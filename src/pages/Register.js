import React, { Component } from "react";
import RegisterHeader from "../components/register/RegisterHeader";
import Footer from "../components/global/Footer";
import Stepper from "../components/register/Stepper";
import { Col, Row, Typography } from "antd";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const { Title, Text } = Typography;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };
  }

  componentWillMount() {
    this.props.user !== null
      ? this.setState({
          isLogin: true
        })
      : this.setState({
          isLogin: false
        });
  }
  
  render() {
    return this.state.isLogin ? (
      <Redirect to="/home" />
    ) : (
      <div>
        <Helmet>
          <title>Register</title>
        </Helmet>
        <RegisterHeader />
        <Row type="flex" justify="center" className="custom_stepper_bar">
          <Col xs={22} sm={22} xl={12}>
            <div style={{ textAlign: "center", margin: "2em 0 3em" }}>
              <Title level={3} style={{ margin: "0.5em" }}>
                Let's Get started
              </Title>
              <Text className="text_gray-3">
                Please fill out the information below to complete the
                registration process.
              </Text>
            </div>
            <Stepper {...this.props} />
          </Col>
        </Row>
        <Footer />
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Register);