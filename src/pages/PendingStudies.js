import React, { Component } from "react";
import {
  Row,
  Col,
  Breadcrumb,
  Typography,
  Input,
  Select,
  notification,
  Pagination,
  Spin
} from "antd";
import { Helmet } from "react-helmet";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import PendingStudyCard from "../components/studies/PendingStudyCard";
import { APIRequest, API_PENDING_STUDY } from "../api";
import NoData from "../components/global/NoData";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const { Text } = Typography;
const { Option } = Select;

export class PendingStudies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studyData: [],
      orderByState: "DESC",
      searchValue: null,
      pageNo: 1
    };
  }

  onChangePage = pageNumber => {
    
    this.setState({ pageNo: pageNumber }, () => {
      this.fetchData();
    });
  };

  handleOrderChange = value => {
    this.setState(
      {
        orderByState: value
      },
      () => {
        this.fetchData();
      }
    );
  };

  onSearch = e => {
    this.setState(
      {
        searchValue: e.target.value
      },
      () => {
        this.fetchData();
      }
    );
  };

  fetchData = () => {
    new APIRequest.Builder()
      .post()
      .setReqId(API_PENDING_STUDY)
      .jsonParams({
        status: "pending",
        orderBy: this.state.orderByState,
        page: this.state.pageNo,
        search: this.state.searchValue
      })
      .reqURL("/study-all-list")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
  };

  componentDidMount() {
    this.fetchData();
  }

  onResponse = (response, reqId) => {
    // this._hideLoader();
    switch (reqId) {
      case API_PENDING_STUDY:
        window.scrollTo(0, 0);
        this.setState({
          data: response.data.study,
          studyData: response.data.study.data
        });
        break;

      default:
        break;
    }
  };

  onError = (response, reqId) => {
    switch (reqId) {
      case API_PENDING_STUDY:
        notification.error({
          message: response
        });

        break;
      default:
        break;
    }
  };

  currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  });

  render() {
    const { studyData, data } = this.state;
    return (
      <div>
        <Helmet>
          <title>Pending Studies</title>
        </Helmet>
        <Header />

        {data && studyData !== undefined ? (
          <Row
            type="flex"
            justify="center"
            className="container_padding min-height-cal-regular"
            style={{ paddingBottom: "100px" }}
          >
            <Col
              xs={{ span: 22 }}
              sm={{ span: 22 }}
              md={{ span: 22 }}
              lg={{ span: 18 }}
            >
              <Row
                type="flex"
                justify="center"
                align="middle"
                style={{
                  borderBottom: "1px solid #D9D9D9",
                  padding: "1em 0"
                }}
              >
                <Col span={12}>
                  <Text className="text_app_color text_semibold text_large">
                    Pending Studies
                  </Text>
                </Col>
                <Col span={12}>
                  <Breadcrumb style={{ float: "right" }}>
                    <Breadcrumb.Item>
                      <Link to={"/home"}>BPRG</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Pending Studies</Breadcrumb.Item>
                  </Breadcrumb>
                </Col>
              </Row>
              <Row type="flex" align="middle" style={{ margin: "1em 0 2em 0" }}>
                <Col
                  xs={{ span: 10 }}
                  sm={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 3 }}
                  style={{ margin: "0.5em 0" }}
                >
                  <Text className="text_large">{data.total} Studies</Text>
                </Col>
                <Col
                  xs={{ span: 14 }}
                  sm={{ span: 18 }}
                  md={{ span: 18 }}
                  lg={{ span: 8 }}
                  style={{ margin: "0.5em 0" }}
                >
                  <Input
                    onChange={this.onSearch}
                    placeholder="Search Studies"
                    suffix={
                      <i className="icon-search text_app_color_light text_normal" />
                    }
                  />
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 13 }}
                  style={{ margin: "0.5em 0" }}
                >
                  <div style={{ float: "right" }}>
                    <Text
                      className="text_gray-3 text_small"
                      style={{ marginRight: "20px" }}
                    >
                      <i className="icon-sort-by " />
                      Sort by
                    </Text>
                    <Select
                      defaultValue="DESC"
                      style={{ width: "150px" }}
                      onChange={this.handleOrderChange}
                    >
                      <Option value="ASC">Oldest First</Option>
                      <Option value="DESC">Latest First</Option>
                    </Select>
                  </div>
                </Col>
              </Row>

              {data.total !== 0 ? (
                <PendingStudyCard
                  cardData={studyData}
                  timezoneProps={this.props.user.user_timezone}
                />
              ) : (
                <NoData />
              )}

              <Row type="flex" justify="center">
                <Col style={{ paddingTop: "10px" }}>
                  <Pagination
                    showQuickJumper
                    pageSize={5}
                    // defaultCurrent={1}
                    total={data.total}
                    onChange={this.onChangePage}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        ) : (
          <div
            className="container_padding min-height-cal-regular"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Spin size="large" />
          </div>
        )}
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

export default connect(mapStateToProps)(PendingStudies);
