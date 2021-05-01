import React, { Component } from "react";
import { Row, Col, Button, Spin } from "antd";
import { Helmet } from "react-helmet";
import Header from "../components/global/Header";
import DetailFooter from "../components/studies/DetailFooter";
import { connect } from "react-redux";
import { APIRequest, API_STUDY_DETAIL } from "../api";
import moment from "moment";

export class PendingStudyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      studyDetail: [],
      study_id: null
    };
  }

  fetchData() {
    this.state.study_id &&
      new APIRequest.Builder()
        .post()
        .setReqId(API_STUDY_DETAIL)
        .reqURL("/study-details")
        .jsonParams({
          study_id: this.state.study_id
        })
        .response(this.onResponse)
        .error(this.onError)
        .build()
        .doRequest();
  }

  componentDidMount() {
    this.setState(
      {
        study_id: this.props.match.params.uuid,
        userData: this.props.user
      },
      () => {
        this.fetchData();
      }
    );
  }

  onResponse = (response, reqId) => {
    // this._hideLoader();
    switch (reqId) {
      case API_STUDY_DETAIL:
        this.setState({
          data: response.data,
          studyDetail: response.data.studyDetails
        });
        break;

      default:
        break;
    }
  };

  onError = (response, reqId) => {
    // console.log("erorr", response);
    switch (reqId) {
      case API_STUDY_DETAIL:
        console.log("error", response);
        // notification.error({
        //   message: response.meta.message
        // });
        break;
      default:
        break;
    }
  };

  render() {
    const { studyDetail, data, userData } = this.state;
    return (
      <div>
        <Helmet>
          <title>Study Detail</title>
        </Helmet>
        <Header />
        {studyDetail && data && studyDetail.user !== undefined ? (
          <div>
            <div className="min-height-cal">
              <Row type="flex" justify="center" className="bg_app_color">
                <Col
                  xs={{ span: 22 }}
                  sm={{ span: 22 }}
                  md={{ span: 22 }}
                  lg={{ span: 18 }}
                  style={{ marginBottom: "1.3em" }}
                >
                  <Button
                    type="link"
                    onClick={() => this.props.history.goBack()}
                    className="btn text_white"
                    style={{ padding: 0 }}
                  >
                    <i
                      className="icon-back-arrow text_white"
                      style={{ marginRight: "5px" }}
                    />
                    Back
                  </Button>
                </Col>
                <Col
                  xs={{ span: 22 }}
                  sm={{ span: 22 }}
                  md={{ span: 22 }}
                  lg={{ span: 18 }}
                >
                  <p className="text_white text_xlarge">{studyDetail.name}</p>
                </Col>
                <Col
                  xs={{ span: 22 }}
                  sm={{ span: 22 }}
                  md={{ span: 22 }}
                  lg={{ span: 18 }}
                >
                  <Row className="text_white" style={{ marginBottom: "1em" }}>
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 12 }}
                      lg={{ span: 6 }}
                      style={{ marginBottom: "0.5em" }}
                    >
                      <span style={{ alignItems: "center", display: "flex" }}>
                        <i className="icon-user text_app_color_light text_large" />
                        {studyDetail.user.first_name}&nbsp;
                        {studyDetail.user.last_name}
                      </span>
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 12 }}
                      lg={{ span: 6 }}
                      style={{ marginBottom: "0.5em" }}
                    >
                      <span style={{ alignItems: "center", display: "flex" }}>
                        <i className="icon-call text_app_color_light text_large" />
                        {studyDetail.user.phone_no}
                      </span>
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 12 }}
                      lg={{ span: 6 }}
                      style={{ marginBottom: "0.5em" }}
                    >
                      <span style={{ alignItems: "center", display: "flex" }}>
                        <i className="icon-mail text_app_color_light text_large" />
                        {studyDetail.user.email}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row
                type="flex"
                style={{ paddingBottom: "4em", paddingTop: "2em" }}
              >
                <Col
                  xs={{ span: 22, push: 1 }}
                  sm={{ span: 22, push: 1 }}
                  md={{ span: 22, push: 1 }}
                  lg={{ span: 19, push: 3 }}
                >
                  <Row type="flex" justify="space-between">
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 24 }}
                      lg={{ span: 19 }}

                      // className="bg_app_color_light"
                    >
                      <Row>
                        <Col
                          xs={{ span: 24 }}
                          sm={{ span: 24 }}
                          md={{ span: 24 }}
                          lg={{ span: 6 }}
                        >
                          <p className="text_gray-3">Length:</p>
                          <p className="text_normal">
                            {studyDetail.length} Minutes
                          </p>
                        </Col>
                        <Col
                          xs={{ span: 12 }}
                          sm={{ span: 12 }}
                          md={{ span: 12 }}
                          lg={{ span: 6 }}
                        >
                          <p className="text_gray-3">Start Date:</p>

                          <p className="text_normal">
                            {moment(studyDetail.start_date.date).format(
                              "MM/DD/YYYY"
                            )}
                          </p>
                        </Col>
                        <Col
                          xs={{ span: 12 }}
                          sm={{ span: 12 }}
                          md={{ span: 12 }}
                          lg={{ span: 6 }}
                        >
                          <p className="text_gray-3">End Date:</p>

                          <p className="text_normal">
                            {moment(studyDetail.end_date.date).format(
                              "MM/DD/YYYY"
                            )}
                          </p>
                        </Col>
                      </Row>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column"
                        }}
                      >
                        <span className="text_gray-3">Description:</span>
                        <span
                          className="text_normal"
                          style={{ margin: "0.7em 0" }}
                        >
                          {studyDetail.description}
                        </span>
                      </div>

                      {studyDetail.schedule_date !== null &&
                        studyDetail.schedule_date.additional_note !== null && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column"
                            }}
                          >
                            <span className="text_gray-3">
                              Additional Note:
                            </span>
                            <span
                              className="text_normal"
                              style={{ margin: "0.7em 0" }}
                            >
                              {studyDetail.schedule_date.additional_note}
                            </span>
                          </div>
                        )}

                      {studyDetail.schedule_date !== null &&
                        (studyDetail.schedule_date.status === 1 ||
                          studyDetail.schedule_date.status === 2) &&
                        studyDetail.schedule_date.reason_reschedule !==
                          null && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column"
                            }}
                          >
                            <span className="text_gray-3">
                              Reschedule Reason:
                            </span>
                            <span
                              className="text_normal"
                              style={{ margin: "0.7em 0" }}
                            >
                              {studyDetail.schedule_date.reason_reschedule}
                            </span>
                          </div>
                        )}

                      {studyDetail.schedule_date !== null &&
                        (studyDetail.schedule_date.status === 3 ||
                          studyDetail.schedule_date.status === null) &&
                        studyDetail.schedule_date.reason_cancellation !==
                          null && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column"
                            }}
                          >
                            <span className="text_gray-3">
                              Cancellation Reason:
                            </span>
                            <span
                              className="text_normal"
                              style={{ margin: "0.7em 0" }}
                            >
                              {studyDetail.schedule_date.reason_cancellation}
                            </span>
                          </div>
                        )}
                    </Col>

                    {studyDetail.invitation.study_status === 2 ? (
                      <Col style={{ display: "inline-block" }}>
                        {studyDetail.invitation.payment.is_completed === 1 ? (
                          <div
                            className="bg_dgreen text_white text_center"
                            style={{
                              padding: "1.5em",
                              borderRadius: "3px",
                              marginBottom: "1em",
                              width: "auto"
                            }}
                          >
                            <span>Honoraria Paid</span>
                            <br />
                            <span className="text_white text_xlarge text_semibold">
                              ${studyDetail.invitation.honoraria}
                            </span>
                          </div>
                        ) : (
                          <div
                            className="bg_dyellow text_white text_center"
                            style={{
                              padding: "1.5em",
                              borderRadius: "3px",
                              marginBottom: "1em",
                              width: "auto"
                            }}
                          >
                            <span>Honoraria Pending</span>
                            <br />
                            <span className="text_white text_xlarge text_semibold">
                              ${studyDetail.invitation.honoraria}
                            </span>
                          </div>
                        )}
                        <div
                          className="text_app_color_light text_center"
                          style={{
                            padding: "1.5em",
                            borderRadius: "3px",
                            border: "1px solid #1890FF"
                          }}
                        >
                          <span>Interviewed on</span>
                          <br />
                          <span>
                            {/* {studyDetail.schedule_date !== null
                              ? studyDetail.schedule_date.date
                              : ""} */}

                            {studyDetail.schedule_date !== null
                              ? moment
                                  .utc(
                                    `${studyDetail.schedule_date.date} ${studyDetail.schedule_date.time}`,
                                    "YYYY-MM-DD HH:mm:ss"
                                  )
                                  .tz(
                                    studyDetail.schedule_date.timezone.timezone
                                  )
                                  .format("MM/DD/YYYY")
                              : ""}
                          </span>
                          <br />

                          <span>
                            {studyDetail.schedule_date !== null
                              ? moment
                                  .utc(
                                    `${studyDetail.schedule_date.date} ${studyDetail.schedule_date.time}`,
                                    "YYYY-MM-DD HH:mm:ss"
                                  )
                                  .tz(
                                    studyDetail.schedule_date.timezone.timezone
                                  )
                                  .format("hh:mm A")
                              : ""}
                            {studyDetail.schedule_date !== null &&
                              `(${studyDetail.schedule_date.timezone.code})`}
                          </span>
                        </div>
                      </Col>
                    ) : (
                      <Col style={{ display: "inline-block" }}>
                        <div
                          className="bg_dgreen text_white text_center"
                          style={{
                            padding: "1.5em",
                            borderRadius: "3px",
                            marginBottom: "1em",
                            width: "auto"
                          }}
                        >
                          <span>Honoraria to be Paid</span>
                          <br />
                          <span className="text_white text_xlarge text_semibold">
                            ${studyDetail.invitation.honoraria}
                          </span>
                        </div>

                        <div
                          className="text_app_color_light text_center"
                          style={{
                            padding: "1.5em",
                            borderRadius: "3px",
                            border: "1px solid #1890FF"
                          }}
                        >
                          <span>Available Slots</span>
                          <br />
                          <span className="text_xlarge text_semibold">
                            {studyDetail.slots - data.accepted}
                          </span>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            </div>

            {studyDetail.invitation !== null ? (
              <DetailFooter
                studyDetail={studyDetail}
                studyStatus={studyDetail.invitation.study_status}
                onCompleted={() => this.fetchData()}
                userData={userData}
                timezoneProps={this.props.user.user_timezone}
              />
            ) : null}
          </div>
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(PendingStudyDetail);
