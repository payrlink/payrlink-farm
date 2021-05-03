import React, { Component } from "react";
import Logo from "../../assets/images/BPRG_WhiteLogo.svg";
import { Button, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";

const { Text } = Typography;

class RegisterHeader extends Component {
  render() {
    return (
      <Row
        className="bg_app_color"
        type="flex"
        justify="space-between"
        align="middle"
        style={{ padding: "20px" }}
      >
        <Col
          sm={{ span: 22, push: 0 }}
          md={{ span: 22, push: 2 }}
          lg={{ span: 11, push: 1 }}
        >
          <div>
            <img
              src={Logo}
              style={{
                height: "50px"
              }}
              alt="logo"
            />
          </div>
        </Col>
        <Col
          sm={{ span: 22, pull: 0 }}
          md={{ span: 22, pull: 2 }}
          lg={{ span: 11, pull: 1 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <div>
            <Text className="text_white">Already have an account? &nbsp;</Text>
            <Button
              className="link_button"
              type="primary"
              style={{ width: "90px" }}
            >
              <Link to="/sign_in">LOG IN</Link>
            </Button>
          </div>
        </Col>
      </Row>
    );
  }
}

export default RegisterHeader;
