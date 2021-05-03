import React, { Component } from "react";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import { Row, Col, Typography, Table, Tooltip, notification } from "antd";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { APIRequest, API_HOME } from "../api";
import { connect } from "react-redux";
// import {moment} from "moment";

const moment = require("moment-timezone");
const { Text } = Typography;
// column for pending studies

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDesktop: false,
      data: [],
      pendingData: [],
      completedData: [],
      currentData: [],
    };

    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount() {
    new APIRequest.Builder()
      .get()
      .setReqId(API_HOME)
      .reqURL("/study-list")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
    this.updatePredicate();

    // for responsive
    window.addEventListener("resize", this.updatePredicate);
  }

  componentWillUnmount() {
    // for responsive
    window.removeEventListener("resize", this.updatePredicate);
  }

  updatePredicate() {
    // for responsive
    this.setState({ isDesktop: window.innerWidth > 991.98 });
  }

  onResponse = (response, reqId) => {
    // this._hideLoader();
    switch (reqId) {
      case API_HOME:
        this.setState({
          data: response.data,
          pendingData: response.data.pending,
          completedData: response.data.completed,
          currentData: response.data.current,
        });
        break;

      default:
        break;
    }
  };

  onError = (response, reqId) => {
    switch (reqId) {
      case API_HOME:
        notification.error({
          message: response.meta.message,
        });
        break;
      default:
        break;
    }
  };

  currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  render() {
    const isDesktop = this.state.isDesktop;
    const { data, pendingData, completedData, currentData } = this.state;

    const pendingStudyCol = [
      {
        title: (
          <Tooltip title="Study Name" placement="topLeft">
            Study Name
          </Tooltip>
        ),
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <Link
            to={`/study/${record.uuid}/detail`}
            className="text_app_color_light"
          >
            {record.name}
          </Link>
        ),
        ellipsis: true,
        width: this.state.isDesktop ? "40%" : "20%",
      },
      {
        title: (
          <Tooltip title="Honoraria" placement="topLeft">
            Honoraria
          </Tooltip>
        ),
        dataIndex: "study_invite[0].honoraria",
        key: "study_invite[0].honoraria",
        render: (text, record) => (
          // <div>
          <div>{this.currencyFormatter.format(text)}</div>
          // </div>
        ),
        ellipsis: true,
        align: "center",
      },
      {
        title: (
          <Tooltip title="Interview Type" placement="topLeft">
            Interview Type
          </Tooltip>
        ),
        dataIndex: "interview",
        key: "interview",
        render: (text, record) => <div>{record.interview_type.name}</div>,
        ellipsis: true,
        align: "center",
      },
      {
        title: (
          <Tooltip title="Length" placement="topLeft">
            Length
          </Tooltip>
        ),
        dataIndex: "length",
        key: "length",
        render: (text, record) => <div>{text} Min</div>,
        ellipsis: true,
        align: "center",
      },
      {
        title: (
          <Tooltip title="Start Date" placement="topLeft">
            Start Date
          </Tooltip>
        ),
        dataIndex: "start_date.date",
        key: "start_date.date",
        render: (text, record) => (
          <div>{moment(text, "YYYY-MM-DD").format("MM/DD/YYYY")}</div>
        ),
        ellipsis: true,
        align: "center",
      },
      {
        title: (
          <Tooltip title="End Date" placement="topLeft">
            End Date
          </Tooltip>
        ),
        dataIndex: "end_date.date",
        key: "end_date.date",
        render: (text, record) => (
          <div>{moment(text, "YYYY-MM-DD").format("MM/DD/YYYY")}</div>
        ),
        ellipsis: true,
        align: "center",
      },
    ];

    // column for current studies
    const currentStudyCol = [
      {
        title: (
          <Tooltip title="Study Name" placement="topLeft">
            Study Name
          </Tooltip>
        ),
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          // <div>
          <Link
            to={`/study/${record.uuid}/detail`}
            className="text_app_color_light"
          >
            {record.name}
          </Link>
          // </div>
        ),
        ellipsis: true,
        width: this.state.isDesktop ? "25%" : "20%",
      },
      {
        title: (
          <Tooltip title="Scheduled" placement="topLeft">
            Scheduled
          </Tooltip>
        ),
        dataIndex: "schedule_dates",
        key: "schedule_dates",
        render: (text, record) => (
          // <div>{text}</div>
          <div>
            {text[0] !== undefined
              ? <>{moment
                  .utc(text[0].date_time, "YYYY-MM-DD HH:mm:ss")
                  .tz(text[0].timezone.timezone)
                  .format("MM/DD/YYYY")}
                  <br />
                  {moment
                  .utc(text[0].date_time, "YYYY-MM-DD HH:mm:ss")
                  .tz(text[0].timezone.timezone)
                  .format("hh:mm A")}
                  </>
              : 'Pending'}<br />
            
          </div>
        ),
        ellipsis: true,
        align: "center",
      },
      {
        title: (
          <Tooltip title="Honoraria" placement="topLeft">
            Honoraria
          </Tooltip>
        ),
        dataIndex: "study_invite[0].honoraria",
        key: "study_invite[0].honoraria",
        render: (text, record) => (
          // <div>
          <div>{this.currencyFormatter.format(text)}</div>
          // </div>
        ),
        ellipsis: true,
        align: "center",
      },
      {
        title: (
          <Tooltip title="Interview Type" placement="topLeft">
            Interview Type
          </Tooltip>
        ),
        dataIndex: "interview",
        key: "interview",
        render: (text, record) => <div>{record.interview_type.name}</div>,
        ellipsis: true,
        align: "center",
      },
      {
        title: (
          <Tooltip title="Length" placement="topLeft">
            Length
          </Tooltip>
        ),
        dataIndex: "length",
        key: "length",
        render: (text, record) => <div>{text} Min</div>,
        ellipsis: true,
        align: "center",
      },
      {
        title: (
          <Tooltip title="Start Date" placement="topLeft">
            Start Date
          </Tooltip>
        ),
        dataIndex: "start_date.date",
        key: "start_date.date",
        render: (text, record) => (
          <div>{moment(text, "YYYY-MM-DD").format("MM/DD/YYYY")}</div>
        ),
        ellipsis: true,
        align: "center",
      },
      {
        title: (
          <Tooltip title="End Date" placement="topLeft">
            End Date
          </Tooltip>
        ),
        dataIndex: "end_date.date",
        key: "end_date.date",
        render: (text, record) => (
          <div>{moment(text, "YYYY-MM-DD").format("MM/DD/YYYY")}</div>
        ),
        ellipsis: true,
        align: "center",
      },
    ];

    // column for past studies
    const pastStudyCol = [
      {
        title: (
          <Tooltip title="Study Name" placement="topLeft">
            Study Name
          </Tooltip>
        ),
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <Link
            to={`/study/${record.uuid}/detail`}
            className="text_app_color_light"
          >
            {record.name}
          </Link>
        ),
        ellipsis: true,
        width: this.state.isDesktop ? "35%" : "10%",
      },
      {
        title: (
          <Tooltip title="Project Manager" placement="topLeft">
            Project Manager
          </Tooltip>
        ),
        dataIndex: "user.first_name",
        key: "user.first_name",
        render: (text, record) => (
          <div>
            {record.user.first_name}&nbsp;{record.user.last_name}
          </div>
        ),
        ellipsis: true,
        align: "center",
        width: "15%",
      },
      {
        title: (
          <Tooltip title="Start Date" placement="topLeft">
            Start Date
          </Tooltip>
        ),
        dataIndex: "start_date.date",
        key: "start_date.date",
        render: (text, record) => (
          <div>{moment(text, "YYYY-MM-DD").format("MM/DD/YYYY")}</div>
        ),
        align: "center",
        ellipsis: true,
        width: "10%",
      },
      {
        title: (
          <Tooltip title="End Date" placement="topLeft">
            End Date
          </Tooltip>
        ),
        dataIndex: "end_date.date",
        key: "end_date.date",
        render: (text, record) => (
          <div>{moment(text, "YYYY-MM-DD").format("MM/DD/YYYY")}</div>
        ),
        align: "center",
        ellipsis: true,
        width: "10%",
      },
    ];

    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <Header />
        <Row
          type="flex"
          justify="center"
          className="container_padding min-height-cal-regular"
        >
          <Col
            xs={{ span: 22 }}
            sm={{ span: 22 }}
            md={{ span: 22 }}
            lg={{ span: 18 }}
          >
            <Row
              type="flex"
              style={{
                borderBottom: "1px solid #D9D9D9",
                padding: "1em 0",
              }}
            >
              <Col span={12}>
                <Text className="text_app_color text_semibold text_large">
                  Home
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
                      marginBottom: "1em",
                    }}
                  >
                    <span className="text_app_color">
                      Pending Study Invites
                    </span>
                    <Link to="pending-studies">
                      <Text className="text_app_color_light text_semibold">
                        View {data.pending_total} Invites
                      </Text>
                    </Link>
                  </div>
                  {isDesktop ? (
                    <Table
                      columns={pendingStudyCol}
                      dataSource={pendingData}
                      size="middle"
                      pagination={false}
                      className="table_border_0"
                    />
                  ) : (
                    <Table
                      columns={pendingStudyCol}
                      dataSource={pendingData}
                      size="middle"
                      pagination={false}
                      className="table_border_0"
                      scroll={{ x: 800 }}
                    />
                  )}
                </div>
              </Col>
              <Col style={{ margin: "2em 0" }}>
                <div className="bordered_div">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "1em",
                    }}
                  >
                    <span className="text_app_color">Current Studies</span>
                    <Link to="current-studies">
                      <Text className="text_app_color_light text_semibold">
                        View {data.current_total} Invites
                      </Text>
                    </Link>
                  </div>
                  {isDesktop ? (
                    <Table
                      columns={currentStudyCol}
                      dataSource={currentData}
                      size="middle"
                      pagination={false}
                      className="table_border_0"
                    />
                  ) : (
                    <Table
                      columns={currentStudyCol}
                      dataSource={currentData}
                      size="middle"
                      pagination={false}
                      className="table_border_0"
                      scroll={{ x: 800 }}
                    />
                  )}
                </div>
              </Col>
              <Col style={{ margin: "2em 0" }}>
                <div className="bordered_div">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "1em",
                    }}
                  >
                    <span className="text_app_color">Completed Studies</span>
                    <Link to="past-studies">
                      <Text className="text_app_color_light text_semibold">
                        View {data.completed_total} Invites
                      </Text>
                    </Link>
                  </div>
                  {isDesktop ? (
                    <Table
                      columns={pastStudyCol}
                      dataSource={completedData}
                      size="middle"
                      pagination={false}
                      className="table_border_0"
                    />
                  ) : (
                    <Table
                      columns={pastStudyCol}
                      dataSource={completedData}
                      size="middle"
                      pagination={false}
                      className="table_border_0"
                      scroll={{ x: 650 }}
                    />
                  )}
                </div>
              </Col>
            </Row>
            <Row type="flex" justify="space-between" gutter={{ lg: 16 }}>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={12}
                style={{ marginBottom: "2em" }}
              >
                <div
                  className="bordered_div"
                  style={{
                    display: "flex",
                    padding: "0 2.5em",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Text className="text_app_color text_large">
                      Honoraria Received {new Date().getFullYear()}
                    </Text>
                    <hr className="custom_line green medium" />
                    <Text className="text_semibold" style={{ fontSize: "3em" }}>
                      {this.currencyFormatter.format(data.length !== 0 ? data.honorariaRecived : 0)}
                    </Text>
                  </div>
                  <div
                    style={{ fontSize: "6em", color: "rgba(89, 89, 89, 0.2)" }}
                    className="text_semibold"
                  >
                    $
                  </div>
                </div>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={12}
                style={{ marginBottom: "2em" }}
              >
                <div
                  className="bordered_div"
                  style={{
                    display: "flex",
                    padding: "0 2.5em",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Text className="text_app_color text_large">
                      Honoraria Pending {moment().format("YYYY")}
                    </Text>
                    <hr className="custom_line red medium" />
                    <Text className="text_semibold" style={{ fontSize: "3em" }}>
                      {this.currencyFormatter.format(data.length !== 0 ? data.honorariaPending : 0)}
                    </Text>
                  </div>
                  <div
                    style={{ fontSize: "6em", color: "rgba(89, 89, 89, 0.2)" }}
                    className="text_semibold"
                  >
                    $
                  </div>
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

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps)(Home);
