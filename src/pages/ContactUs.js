import React from "react";
import { Helmet } from "react-helmet";
import { Row, Col } from "antd";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";

const ContactUs = () => {
  return (
    <div>
      <Helmet>
        <title>Contact Us</title>
      </Helmet>
      <Header />
      <Row
        className="bg_app_color map-background"
        type="flex"
        justify="center"
        align="middle"
      >
        <Col span={22} style={{ height: "100%" }}>
          <p className="text_white mb-0" style={{ fontSize: "48px" }}>
            Get in Touch
          </p>
        </Col>
      </Row>
      <Row type="flex" justify="center" style={{ padding: "3em 0em" }}>
        <Col
          xs={{ span: 22 }}
          sm={{ span: 22 }}
          md={{ span: 12 }}
          lg={{ span: 6 }}
          className="contact_info_class"
        >
          <div style={{ display: "flex" }}>
            <div style={{ marginTop: "0.7em" }}>
              <i
                className="icon-call-2 text_app_color_light"
                style={{ fontSize: "32px", marginRight: "0.3em" }}
              />
            </div>
            <div>
              <p
                className="text_xlarge text_gray-4 text_semibold mb-0"
                style={{ margin: "0.7em 0" }}
              >
                Call us
              </p>
              <p style={{ color: "#6B6E71", marginBottom: "0.5em" }}>
                Office Phone: 609-613-3272
              </p>
              {/* <p style={{ color: "#6B6E71", marginBottom: "0.5em" }}>
                Office Phone: 111-222-3333
              </p> */}
            </div>
          </div>
        </Col>
        <Col
          xs={{ span: 22 }}
          sm={{ span: 22 }}
          md={{ span: 12 }}
          lg={{ span: 6 }}
          className="side_divider contact_info_class"
        >
          <div style={{ display: "flex" }}>
            <div style={{ marginTop: "0.7em" }}>
              <i
                className="icon-location text_app_color_light"
                style={{ fontSize: "32px", marginRight: "0.3em" }}
              />
            </div>
            <div>
              <p
                className="text_xlarge text_gray-4 text_semibold mb-0"
                style={{ margin: "0.7em 0" }}
              >
                Where to find us
              </p>
              <p style={{ color: "#6B6E71", marginBottom: "0.5em" }}>
                600 Alexander Road Suite 1-1D,
              </p>
              <p style={{ color: "#6B6E71", marginBottom: "0.5em" }}>
                Princeton, NJ 08540
              </p>
            </div>
          </div>
        </Col>
        <Col
          xs={{ span: 22 }}
          sm={{ span: 22 }}
          md={{ span: 12 }}
          lg={{ span: 6 }}
          className="contact_info_class"
        >
          <div style={{ display: "flex" }}>
            <div style={{ marginTop: "0.7em" }}>
              <i
                className="icon-mail text_app_color_light"
                style={{ fontSize: "32px", marginRight: "0.3em" }}
              />
            </div>
            <div>
              <p
                className="text_xlarge text_gray-4 text_semibold mb-0"
                style={{ margin: "0.7em 0" }}
              >
                Write to us
              </p>
              <p style={{ color: "#6B6E71", marginBottom: "0.5em" }}>
              ckaty@blueprintrg.com
              </p>
              {/* <p style={{ color: "#6B6E71", marginBottom: "0.5em" }}>
                info@blueprintrg.com
              </p> */}
            </div>
          </div>
        </Col>
      </Row>
      <Footer />
    </div>
  );
};

export default ContactUs;
