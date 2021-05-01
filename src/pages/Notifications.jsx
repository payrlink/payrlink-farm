/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Row, Col, Typography, List, Select, Button, notification } from "antd";
import { Helmet } from "react-helmet";
import { APIRequest, API_NOTIFICATIONS } from "../api";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import moment from "moment";
import { connect } from "react-redux";

const { Text } = Typography;
const { Option } = Select;

export class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationsData: [],
      finalNotificationsData: [],
      orderByState: 1,
      lastRecord: []
    };
  }

  fetchData() {
    new APIRequest.Builder()
      .post()
      .setReqId(API_NOTIFICATIONS)
      .jsonParams({
        sorting: this.state.orderByState,
        notification_id: this.state.lastRecord.id
      })
      .reqURL("/notification-fetch")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
  }

  loadMore = () => {
    this.fetchData();
  };

  componentDidMount() {
    this.fetchData();
  }

  handleOrderChange = value => {
    this.setState(
      {
        orderByState: value,
        finalNotificationsData: [],
        lastRecord: []
      },
      () => {
        this.fetchData();
      }
    );
  };

  onResponse = (response, reqId) => {
    // this._hideLoader();
    switch (reqId) {
      case API_NOTIFICATIONS:
        let responseData = response.data.notifications.data;
        this.setState(
          {
            notificationsData: responseData,
            lastRecord: responseData[responseData.length - 1]
          },
          () => {
            let finalNotificationsData = [
              ...this.state.finalNotificationsData,
              ...this.state.notificationsData
            ];
            this.setState({
              finalNotificationsData: finalNotificationsData
            });
            
          }
        );

        break;

      default:
        break;
    }
  };

  onError = (response, reqId) => {
    switch (reqId) {
      case API_NOTIFICATIONS:
        notification.error({
          message: response
        });

        break;
      default:
        break;
    }
  };

  render() {
    const data =
      this.state.finalNotificationsData !== null &&
      this.state.finalNotificationsData;

    return (
      <div>
        <Helmet>
          <title>Notifications</title>
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
              style={{
                borderBottom: "1px solid #D9D9D9",
                padding: "1em 0"
              }}
            >
              <Col span={8}>
                <Text className="text_app_color text_semibold text_large">
                  Notifications
                </Text>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 16 }}
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
                    defaultValue={1}
                    style={{ width: "150px" }}
                    onChange={this.handleOrderChange}
                  >
                    <Option value={0}>Oldest First</Option>
                    <Option value={1}>Latest First</Option>
                  </Select>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <List
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={item => (
                    <List.Item>
                      {(() => {
                        switch (item.type) {
                          case 1:
                            return (
                              <List.Item.Meta
                                avatar={
                                  <div
                                    className="bg_app_color text_white"
                                    style={{
                                      borderRadius: "100px",
                                      padding: "3px",
                                      marginRight: "20px"
                                    }}
                                  >
                                    <i
                                      className="icon-approve-tick"
                                      style={{ fontSize: "30px" }}
                                    />
                                  </div>
                                }
                                title={
                                  <a
                                    href={`study/${item.study.uuid}/detail`}
                                    className="text_app_color text_normal"
                                  >
                                    Study Approved
                                  </a>
                                }
                                description={
                                  <div>
                                    <Text>
                                      Your study on&nbsp;{item.study.name}
                                      &nbsp; has been approved.
                                    </Text>
                                    <br />
                                    <small>
                                      {moment.utc(item.created_at).fromNow()}
                                    </small>
                                  </div>
                                }
                              />
                            );

                          case 2:
                            return (
                              <List.Item.Meta
                                avatar={
                                  <div
                                    className="bg_app_color_light text_white"
                                    style={{
                                      borderRadius: "100px",
                                      padding: "3px",
                                      marginRight: "20px"
                                    }}
                                  >
                                    <i
                                      className="icon-file-2"
                                      style={{ fontSize: "30px" }}
                                    />
                                  </div>
                                }
                                title={
                                  <a
                                    href={`study/${item.study.uuid}/detail`}
                                    className="text_app_color text_normal"
                                  >
                                    New Study Invite
                                  </a>
                                }
                                description={
                                  <div>
                                    <Text>
                                      New Study Invite Available on&nbsp;
                                      {item.study.name}
                                      &nbsp;.
                                    </Text>
                                    <br />
                                    <small>
                                      {moment.utc(item.created_at).fromNow()}
                                    </small>
                                  </div>
                                }
                              />
                            );
                          case 3:
                            return (
                              <List.Item.Meta
                                avatar={
                                  <div
                                    className="bg_dyellow text_white"
                                    style={{
                                      borderRadius: "100px",
                                      padding: "3px",
                                      marginRight: "20px"
                                    }}
                                  >
                                    <i
                                      className="icon-watch"
                                      style={{ fontSize: "30px" }}
                                    />
                                  </div>
                                }
                                title={
                                  <a
                                    href={`study/${item.study.uuid}/detail`}
                                    className="text_dyellow text_normal"
                                  >
                                    Study Reminder
                                  </a>
                                }
                                description={
                                  <div>
                                    <Text>Your Study is remaining</Text>
                                    <br />
                                    <small>
                                      {moment.utc(item.created_at).fromNow()}
                                    </small>
                                  </div>
                                }
                              />
                            );
                          case 4:
                            return (
                              <List.Item.Meta
                                avatar={
                                  <div
                                    className="bg_dgreen text_white"
                                    style={{
                                      borderRadius: "100px",
                                      padding: "3px",
                                      marginRight: "20px"
                                    }}
                                  >
                                    <i
                                      className="icon-approve-tick"
                                      style={{ fontSize: "30px" }}
                                    />
                                  </div>
                                }
                                title={
                                  <a
                                    href="#"
                                    className="text_dgreen text_normal"
                                  >
                                    Profile approved
                                  </a>
                                }
                                description={
                                  <div>
                                    <Text>Your Profile has been approved.</Text>{" "}
                                    <br />
                                    <small>
                                      {moment.utc(item.created_at).fromNow()}
                                    </small>
                                  </div>
                                }
                              />
                            );
                          case 5:
                            return (
                              <List.Item.Meta
                                avatar={
                                  <div
                                    className="bg_dgreen text_white"
                                    style={{
                                      borderRadius: "100px",
                                      padding: "3px",
                                      marginRight: "20px"
                                    }}
                                  >
                                    <i
                                      className=" icon-file"
                                      style={{ fontSize: "30px" }}
                                    />
                                  </div>
                                }
                                title={
                                  <a
                                    href={`study/${item.study.uuid}/detail`}
                                    className="text_dgreen text_normal"
                                  >
                                    Payment Received
                                  </a>
                                }
                                description={
                                  <div>
                                    <Text>
                                      Your payment for &nbsp;
                                      {item.study.name}&nbsp;has been made.
                                    </Text>
                                    <br />
                                    <small>
                                      {moment.utc(item.created_at).fromNow()}
                                    </small>
                                  </div>
                                }
                              />
                            );
                          case 6:
                            return (
                              <List.Item.Meta
                                avatar={
                                  <div
                                    className="bg_app_color text_white"
                                    style={{
                                      borderRadius: "100px",
                                      padding: "3px",
                                      marginRight: "20px"
                                    }}
                                  >
                                    <i
                                      className=" icon-file"
                                      style={{ fontSize: "30px" }}
                                    />
                                  </div>
                                }
                                title={
                                  <a
                                    href={`study/${item.study.uuid}/detail`}
                                    className="text_app_color text_normal"
                                  >
                                    Study Completed
                                  </a>
                                }
                                description={
                                  <div>
                                    <Text>
                                      Your Study on&nbsp;{item.study.name}
                                      &nbsp;has been Completed
                                    </Text>
                                    <br />
                                    <small>
                                      {moment.utc(item.created_at).fromNow()}
                                    </small>
                                  </div>
                                }
                              />
                            );
                          default:
                            return null;
                        }
                      })()}
                    </List.Item>
                  )}
                />
              </Col>
              <Col
                span={24}
                style={{ display: "flex", justifyContent: "center" }}
              >
                {this.state.lastRecord &&
                  this.state.lastRecord !== null &&
                  this.state.finalNotificationsData.length >= 5 && (
                    <Button onClick={this.loadMore} style={{marginTop:"3em"}}>
                      Load More Notifications
                    </Button>
                  )}
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

export default connect(mapStateToProps)(Notifications);
