import React, { Component } from "react";
import Header from "../components/global/Header";
import RegisterHeader from "../components/register/RegisterHeader";
import Footer from "../components/global/Footer";
import { Row, Col, Typography, notification } from "antd";
import { Helmet } from "react-helmet";
import { APIRequest, API_GET_CONTENT } from "../api";
import { connect } from "react-redux";
const { Text } = Typography;

export class HelpCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    new APIRequest.Builder()
      .post()
      .setReqId(API_GET_CONTENT)
      .jsonParams({ content_type: 1 })
      .reqURL("/get_content")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();

    // for responsive
  }

  onResponse = (response, reqId) => {
    // this._hideLoader();
    switch (reqId) {
      case API_GET_CONTENT:
        this.setState({
          data: response.data.content
        });
        break;

      default:
        break;
    }
  };

  onError = (response, reqId) => {
    switch (reqId) {
      case API_GET_CONTENT:
        notification.error({
          message: response.meta.message
        });
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>Help Center</title>
        </Helmet>
        {this.props.user ? <Header /> : <RegisterHeader />}
        <Row type="flex" justify="center" className="container_padding min-height-cal-regular" style={{paddingBottom: "2em"}}>
          <Col
            xs={{ span: 22 }}
            sm={{ span: 22 }}
            md={{ span: 22 }}
            lg={{ span: 18 }}
          >
            <Row
              type="flex"
              justify="center"
              style={{
                borderBottom: "1px solid #D9D9D9",
                padding: "1em 0"
              }}
            >
              <Col span={24}>
                <Text className="text_app_color text_semibold text_large">
                  Help Center
                </Text>
              </Col>
            </Row>
            <Row>
            <Col span={24} style={{ margin: "2em 0", overflow:"auto" }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.state.data.description
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(HelpCenter);
