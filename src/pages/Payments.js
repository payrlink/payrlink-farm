/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import {
  Row,
  Col,
  Checkbox,
  Typography,
  Table,
  Tooltip,
  Menu,
  Dropdown,
  notification
} from "antd";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { APIRequest, API_PAYMENT } from "../api";
import moment from "moment";

const { Text } = Typography;

const checkboxStyle = {
  display: "flex",
  height: "30px",
  marginLeft: 0,
  alignItems: "center"
};

export default class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDesktop: false,
      data: [],
      filter: [],
      current_page: null
    };
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  paymentApiCall() {
    new APIRequest.Builder()
      .post()
      .setReqId(API_PAYMENT)
      .jsonParams({ page: 1, filter: this.state.filter })
      .reqURL("/payment-list")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
  }
  onChange = checkedValues => {
    this.setState(
      {
        filter: checkedValues
      },
      () => {
        this.paymentApiCall();
      }
    );
  };

  componentDidMount() {
    this.paymentApiCall();

    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePredicate);
  }

  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 991.98 });
  }

  onResponse = (response, reqId) => {
    // this._hideLoader();
    switch (reqId) {
      case API_PAYMENT:
        this.setState({
          data: response.data.payment.data,
          current_page: response.data.payment.current_page
        });
        break;

      default:
        break;
    }
  };

  onError = (response, reqId) => {
    switch (reqId) {
      case API_PAYMENT:
        notification.error({
          message: response.meta.message
        });
        break;
      default:
        break;
    }
  };

  render() {
    const { data } = this.state;
    const isDesktop = this.state.isDesktop;

    const menu = (
      <Menu>
        <Menu.Item>
          <Checkbox.Group
            style={{ width: "100%", padding: "2px" }}
            onChange={this.onChange}
          >
            <Checkbox value={0} style={checkboxStyle}>
              Pending Payment
            </Checkbox>
            <Checkbox value={1} style={checkboxStyle}>
              Received Payment
            </Checkbox>
          </Checkbox.Group>
        </Menu.Item>
      </Menu>
    );

    const paymentColumn = [
      {
        title: <Tooltip title="Study Name">Study Name</Tooltip>,
        dataIndex: "study_invite.study.name",
        key: "StudyName",
        render: (text, record) => (
          <Link
            to={`/study/${record.study_invite.study.uuid}/detail`}
            className="text_app_color_light"
          >
            {text}
          </Link>
        ),
        width: "30%"
      },
      {
        title: (
          <Tooltip title="Interview Date" placement="topLeft">
            Interview Date
          </Tooltip>
        ),
        dataIndex: "study_invite.study.schedule_date.date",
        key: "interviewdate",
        render: text => (
          <Text>{text && moment(text, "YYYY-MM-DD").format("MM/DD/YYYY")}</Text>
        ),
        ellipsis: true,
        align: "center",
        width: "13%"
      },
      {
        title: (
          <Tooltip title="Project Manager" placement="topLeft">
            Project Manager
          </Tooltip>
        ),
        dataIndex: "study_invite.study.user",
        key: "ProjectManager",
        render: (text, render) => (
          <div>
            <Text>{`${text.first_name} ${text.last_name}`}</Text>
            <br />
            <Text>{text.phone_no}</Text>
            <br />
            <Text>{text.email}</Text>
          </div>
        ),
        ellipsis: true,
        align: "center",
        width: "21%"
      },
      {
        title: (
          <Tooltip title="Honoraria" placement="topLeft">
            Honoraria
          </Tooltip>
        ),
        dataIndex: "study_invite.honoraria",
        key: "honoratia",
        render: (text, render) => <div>${text}</div>,
        ellipsis: true,
        align: "center",
        width: "10%"
      },
      {
        title: (
          <Tooltip title="Payment Method" placement="topLeft">
            Payment Method
          </Tooltip>
        ),
        dataIndex: "payment_preference.name",
        key: "paymentmethod",
        render: (text, render) => <div>{text}</div>,
        align: "center"
      },
      {
        title: (
          <>
            <Tooltip title="Payment Status" placement="topLeft">
              Payment Status
            </Tooltip>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                <i
                  className="icon-filter"
                  style={{ fontSize: "16px", padding: "0", color: "#1890ff" }}
                />
              </a>
            </Dropdown>
          </>
        ),
        dataIndex: "is_completed",
        key: "paymentstatus",
        render: text => (
          <div className={text === 0 ? "text_red" : "text_green"}>
            {text === 0 ? "Pending" : "Received"}
          </div>
        ),
        align: "center"
      }
    ];

    return (
      <div className="payment-table">
        <Helmet>
          <title>Payments</title>
        </Helmet>
        <Header />
        <Row type="flex" justify="center" className="container_padding min-height-cal-regular">
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
                  Payments
                </Text>
              </Col>
            </Row>
            <Row>
              <Col style={{ margin: "2em 0" }}>
                <div className="bordered_div">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "1em"
                    }}
                  >
                    <span className="text_app_color">Payments</span>
                  </div>
                  {isDesktop ? (
                    <Table
                      columns={paymentColumn}
                      dataSource={data}
                      size="middle"
                      pagination={true}
                    />
                  ) : (
                    <Table
                      columns={paymentColumn}
                      dataSource={data}
                      size="middle"
                      pagination={true}
                      scroll={{ x: 800 }}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Footer />
      </div>
    );
  }
}
