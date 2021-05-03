import React, { Component } from "react";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
      <Row
        type="flex"
        align="middle"
        justify="center"
        className="bg_footer"
        style={{ padding: "20px" }}
      >
        <Col lg={{ span: 10, push: 2 }}>
          <Row type="flex" className="footer_class">
            {/* <Col className="footer_element">
              <h5>
                <Link to="/support">Support</Link>
              </h5>
            </Col>
            <Col className="footer_element">
              <h5>
                <Link to="/help-center">Help Center</Link>
              </h5>
            </Col> */}
            <Col className="footer_element">
              <h5>
                <Link to="/privacy">Privacy</Link>
              </h5>
            </Col>
            <Col className="footer_element">
              <h5>
                <Link to="/terms-of-service">Terms of Service</Link>
              </h5>
            </Col>
          </Row>
        </Col>

        <Col lg={{ span: 14, pull: 1 }}>
          <h5 className="footer_copyright">
            Copyright <span className="text_normal">&copy;</span>{" "}
            {new Date().getFullYear()} by BluePrint Research Group
          </h5>
        </Col>
      </Row>
    );
  }
}

export default Footer;
