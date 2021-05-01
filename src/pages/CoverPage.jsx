/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Button, Typography, notification } from "antd";
import { Link, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Logo from "../assets/images/Logo.svg";
import SignInBg from "../assets/images/SignIn_background.jpg";
import Footer from "../components/global/Footer";
import { connect } from "react-redux";

const CoverPage = (props) => {

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    props.user !== null ? setIsLogin(true) : setIsLogin(false);
  });

  return (
    isLogin ? (
      <Redirect to="/home" />
    ) : (
    <div>
      <Row
        type="flex"
        justify="end"
        style={{
          minHeight: "90vh",
          backgroundImage: `url(${SignInBg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <Col
          xs={{ span: "24" }}
          sm={{ span: "24" }}
          lg={{ span: "12" }}
          xl={{ span: "8" }}
          className="main_cover"
        >
          <div className="cover_page">
            <div className="cover_logo">
              <img src={Logo} style={{ height: "100%" }} />
            </div>
            <div>
              <p>
                BluePrint Research Group is a leader in global marketing
                research, with a specific focus on the healthcare and
                pharmaceutical industries. Join BluePrintHCP and share your
                experiences & opinions on a number of important topics. You will
                be invited to participate in research studies that are relevant
                to your areas of expertise. These studies may include online
                surveys, telephone interviews and/or in-person interviews. Join
                our panel today to begin receiving invitations for upcoming
                studies.
              </p>
            </div>
            <div className="cover_button_bar">
              <Button
                className="link_button"
                type="primary"
                style={{ margin: "10px" }}
              >
                <Link to="/sign_in">LOG IN</Link>
              </Button>
<br />
              <Button
                className="link_button"
                type="primary"
                style={{ margin: "10px" }}
              >
                <Link to="/register">REGISTER</Link>
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Footer />
    </div>
  ));
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(CoverPage);
