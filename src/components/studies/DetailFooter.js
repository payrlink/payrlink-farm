/* eslint-disable array-callback-return */
/* eslint-disable no-fallthrough */
/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Radio,
  DatePicker,
  Select,
  Input,
  notification,
  Typography,
  Rate,
} from "antd";
import {
  APIRequest,
  API_SEE_AVAILABILITY,
  API_ADD_REVIEW,
  API_SCHEDULE_INTERVIEW,
  API_CANCEL_INTERVIEW,
  API_RESCHEDULE_INTERVIEW,
  API_TIME_ZONE,
} from "../../api";
import { connect } from "react-redux";

import moment from "moment";

const { Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;

export class DetailFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visible1: false,
      visible2: false,
      visible_submit_review: false,
      dataAvailability: [],
      allocatedDateTimes: [],
      studyId: "",
      searchDate: "",
      rating: -1,
      review: "",
      name: "",
      selectedSlot: null,
      status: 0,
      cancelReason: null,
      rescheduleReason: null,
      visibleReschedule: false,
      visibleCancelM: false,
      interviewTime: "",
      interviewDate: "",
      interviewTimezone: "",
      interviewNote: null,
      interviewStaus: null,
      timezoneList: [],
      slotArray: {},
      dateArray: [],
    };
  }

  fetchTimeZone() {
    new APIRequest.Builder()
      .get()
      .setReqId(API_TIME_ZONE)
      .reqURL("/get-timezone")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
  }

  static getDerivedStateFromProps(props, state) {
    return {
      studyId: props.studyDetail.uuid,
      interviewStaus:
        props.studyDetail.schedule_date !== null
          ? props.studyDetail.schedule_date.status
          : null,
      reviewData: props.studyDetail.review,
    };
  }
  componentDidMount() {
    this.setState(
      {
        selectedTimezone:
          this.props.user.user_timezone &&
          this.props.user.user_timezone.timezone,
        timezoneName:
          this.props.user.user_timezone && this.props.user.user_timezone.name,
      },
      () => {
        this.fetchTimeZone();
      }
    );
  }

  showModal = (status) => {
    this.setState(
      {
        status: status,
        visible: true,
      },
      () => {
        this.avaibility(this.state.studyId);
      }
    );
  };

  showModal1 = (dataAvailability) => {
    this.setState(
      {
        visible1: true,
        visible: false,
      },
      () => {
        this.avaibility(this.state.studyId);
      }
    );
  };

  showModal2 = (name) => {
    this.setState({
      visible2: true,
      name: name,
    });
  };

  showSubmitedReview = (name) => {
    this.setState({
      visible_submit_review: true,
      name: name,
    });
  };

  showRescheduleModal = () => {
    this.setState({
      visibleReschedule: true,
      visible: false,
    });
  };

  closeModal = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleBack = (e) => {
    this.setState({
      visible: true,
      visible1: false,
      visible2: false,
      visible_submit_review: false,
      visibleReschedule: false,
    });
  };

  onChangeDate = (date, dateString) => {
    this.setState(
      {
        searchDate: dateString,
      },
      () => {
        this.avaibility();
      }
    );
  };

  changeTimeZone = (value, title) => {
    this.setState(
      {
        selectedTimezone: value,
        timezoneName: title.props.title,
      },
      () => {
        this.avaibility();
      }
    );
  };

  avaibility = (e) => {
    new APIRequest.Builder()
      .post()
      .setReqId(API_SEE_AVAILABILITY)
      .jsonParams({
        study_id: this.state.studyId,
        date: this.state.searchDate,
      })
      .reqURL("/see-availability")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
  };

  enterScreener = (e, surveyLink) => {
    confirm({
      title: "Enter Screener",
      content: <p>Please click continue to enter the screener.</p>,
      className: "info_modal_normal custom_header_color",
      okText: "Continue",
      centered: "true",
      icon: "none",
      cancelText: "Cancel",
      onOk: () => {
        let finalLink = `${surveyLink}?Email=${
          this.props.userData.email
        }&FirstName=${this.props.userData.first_name.replace(
          / /g,
          ""
        )}&LastName=${this.props.userData.last_name.replace(/ /g, "")}`;
        window.open(finalLink, "_blank");
      },
      onCancel() {},
    });
  };

  // onChangeNote = e => {
  //   this.setState({
  //     interviewNote: e.target.value
  //   });
  // };

  scheduleInterview = (date, time, interview_notes) => {
    new APIRequest.Builder()
      .post()
      .setReqId(API_SCHEDULE_INTERVIEW)
      .jsonParams({
        study_id: this.state.studyId,
        date,
        timezone: this.state.selectedTimezone,
        time,
        additional_notes: interview_notes,
      })
      .reqURL("/schedule")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();

    this.setState({
      visible: false,
      visible1: false,
    });
    // Modal.success({
    //   title: "Thank you!",
    //   centered: "true",
    //   icon: "none",
    //   content: (
    //     <p>Your interview is scheduled on November 8th at 11:30am (EST).</p>
    //   ),
    //   maskClosable: "true",
    //   width: "350px",
    //   maskStyle: { backgroundColor: "rgba(0, 39, 102, 0.7)" },
    //   className: "info_modal_normal custom_header_color",
    //   onOk() {}
    // });
  };

  reScheduleInterview = (date, time, interviewNote, reason) => {
    new APIRequest.Builder()
      .post()
      .setReqId(API_RESCHEDULE_INTERVIEW)
      .jsonParams({
        study_id: this.state.studyId,
        date,
        timezone: this.state.selectedTimezone,
        time,
        reschedule_notes: reason,
        additional_notes: interviewNote,
      })
      .reqURL("/reschedule")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();

    this.setState({
      visible: false,
      visible1: false,
      visibleReschedule: false,
    });
  };

  addReview = () => {
    new APIRequest.Builder()
      .post()
      .setReqId(API_ADD_REVIEW)
      .jsonParams({
        study_id: this.state.studyId,
        rate: this.state.rating,
        details: this.state.review,
      })
      .reqURL("/add-review")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();

    this.setState({
      visible2: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
      visible1: false,
      visible2: false,
      visible_submit_review: false,
      visibleReschedule: false,
      selectedSlot: null,
      visibleCancelM: false,
      rating: -1,
      review: ""
    });
  };

  handleCancel1 = async (e) => {
    this.setState({
      visible1: false,
    });
  };

  onChange = (e) => {
    this.setState({
      selectedSlot: e.target.value,
      interviewTime: moment(
        e.target.value.split(" ").slice(1, 4).join(" "),
        "YYYY-MM-DD HH:mm:ss"
      ).format("HH:mm:ss"),
      interviewDate: moment(
        e.target.value.split(" ").slice(1, 4).join(" "),
        "YYYY-MM-DD HH:mm:ss"
      ).format("YYYY-MM-DD"),
    });
  };

  timeSloat = (date, allocatedDateTimes, slotArray) => {
    let allTimes = [];

    slotArray[date].map((e) => allTimes.push(e.start_date_time));

    return allTimes.map((timeValue, index) => {
      return (
        moment
          .tz(timeValue, this.state.selectedTimezone)
          .utc()
          .format("YYYY-MM-DD HH:mm:ss") >
          moment.utc().format("YYYY-MM-DD HH:mm:ss") && (
          <Radio.Button
            checked={false}
            value={`${moment
              .tz(timeValue, this.state.selectedTimezone)
              .utc()
              .format("YYYY-MM-DD HH:mm:ss")} ${index}`}
            disabled={
              allocatedDateTimes.findIndex(
                (element) =>
                  `${element.date} ${element.time}` ===
                  moment
                    .tz(timeValue, this.state.selectedTimezone)
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss")
              ) !== -1
            }
          >
            {moment(timeValue).format("hh:mm A")}
          </Radio.Button>
        )
      );
    });
  };

  // timeSloat1 = (
  //   // id,
  //   // date,
  //   // start_time,
  //   // end_time,
  //   // slot,
  //   // allocatedSlot,
  //   // start_date_time,
  //   // end_date_time

  //   date,
  //   allocatedDateTimes,
  //   slotArray
  // ) => {
  //   let startTime = moment.utc(start_time, "HH:mm:ss").format("HH:mm:ss");
  //   let endTime = moment.utc(end_time, "HH:mm:ss").format("HH:mm:ss");

  //   let startTimeTz = moment
  //     .utc(start_date_time, "YYYY-MM-DD HH:mm:ss")
  //     .tz(this.state.selectedTimezone)
  //     .format("YYYY-MM-DD HH:mm:ss");
  //   let endTimeTz = moment
  //     .utc(end_date_time, "YYYY-MM-DD HH:mm:ss")
  //     .tz(this.state.selectedTimezone)
  //     .format("YYYY-MM-DD HH:mm:ss");

  //   // calculate total duration

  //   let duration = moment(endTimeTz, "YYYY-MM-DD HH:mm:ss").diff(
  //     moment(startTimeTz, "YYYY-MM-DD HH:mm:ss"),
  //     "hours"
  //   );

  //   let allTimes = [];
  //   let endTimeNull = moment(startTimeTz, "YYYY-MM-DD HH:mm:ss").format(
  //     "YYYY-MM-DD HH:mm:ss"
  //   );

  //   // for 30 minutes
  //   if (slot === 30) {
  //     allTimes.push(
  //       moment(startTimeTz, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
  //     );
  //     for (let i = 0; i < duration * 2; ++i) {
  //       endTimeNull = moment(endTimeNull, "YYYY-MM-DD HH:mm:ss")
  //         .add(30, "minutes")
  //         .format("YYYY-MM-DD HH:mm:ss");
  //       allTimes.push(
  //         moment(endTimeNull, "YYYY-MM-DD HH:mm:ss").format(
  //           "YYYY-MM-DD HH:mm:ss"
  //         )
  //       );
  //     }

  //     // allTimes.pop(endTime);
  //     let lastTimeHalf = allTimes.find((element) => element === endTimeTz);
  //     lastTimeHalf && allTimes.pop(lastTimeHalf);
  //   }
  //   // for 60 minutes
  //   else if (slot === 60) {
  //     allTimes.push(
  //       moment(startTimeTz, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
  //     );
  //     for (let i = 0; i < duration; i++) {
  //       endTimeNull = moment(endTimeNull, "YYYY-MM-DD HH:mm:ss")
  //         .add(60, "minutes")
  //         .format("YYYY-MM-DD HH:mm:ss");
  //       allTimes.push(
  //         moment(endTimeNull, "YYYY-MM-DD HH:mm:ss").format(
  //           "YYYY-MM-DD HH:mm:ss"
  //         )
  //       );
  //     }

  //     let lastTimeFull = allTimes.find((element) => element === endTimeTz);
  //     lastTimeFull && allTimes.pop(lastTimeFull);
  //   }

  //   return allTimes.map((timeValue, index) => {
  //     return (
  //       moment
  //         .tz(timeValue, this.state.selectedTimezone)
  //         .utc()
  //         .format("YYYY-MM-DD HH:mm:ss") >
  //         moment.utc().format("YYYY-MM-DD HH:mm:ss") && (
  //         <Radio.Button
  //           checked={false}
  //           value={`${id} ${moment
  //             .tz(timeValue, this.state.selectedTimezone)
  //             .utc()
  //             .format("YYYY-MM-DD HH:mm:ss")} ${index}`}
  //           disabled={
  //             allocatedSlot.findIndex(
  //               (element) =>
  //                 `${element.date} ${element.time}` ===
  //                 moment
  //                   .tz(timeValue, this.state.selectedTimezone)
  //                   .utc()
  //                   .format("YYYY-MM-DD HH:mm:ss")
  //             ) !== -1
  //           }
  //         >
  //           {moment(timeValue).format("hh:mm A")}
  //         </Radio.Button>
  //       )
  //     );
  //   });
  // };

  cancelSchedule = () => {
    this.setState({
      studyId: this.state.studyId,
      visibleCancelM: true,
    });
  };

  cancelSchedule1 = () => {
    new APIRequest.Builder()
      .post()
      .setReqId(API_CANCEL_INTERVIEW)
      .jsonParams({
        study_id: this.state.studyId,
        reason_cancellation: this.state.cancelReason,
      })
      .reqURL("/schedule-cancel")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();

    this.setState(
      {
        visibleCancelM: false,
      },
      () => {
        this.setState({ cancelReason: null });
      }
    );
  };

  dateTimeChange() {
    let slotArrayTemp = {};
    var dateArrayTemp = this.state.dataAvailability
      .filter(
        (item, index, self) =>
          self.findIndex((selfItem) => selfItem.date === item.date) === index
      )
      .map((item) => item.date);

    var dateArrayTemp2 = this.state.dataAvailability
      .filter(
        (item, index, self) =>
          self.findIndex(
            (selfItem) =>
              moment
                .utc(selfItem.start_date_time, "YYYY-MM-DD HH:mm:ss")
                .tz(this.state.selectedTimezone)
                .format("YYYY-MM-DD") ===
              moment
                .utc(item.start_date_time, "YYYY-MM-DD HH:mm:ss")
                .tz(this.state.selectedTimezone)
                .format("YYYY-MM-DD")
          ) === index
      )
      .map((item) =>
        moment
          .utc(item.start_date_time, "YYYY-MM-DD HH:mm:ss")
          .tz(this.state.selectedTimezone)
          .format("YYYY-MM-DD")
      );

    dateArrayTemp2.map((e) => {
      slotArrayTemp[e] = this.state.dataAvailability
        .filter(
          (item) =>
            moment
              .utc(item.start_date_time, "YYYY-MM-DD HH:mm:ss")
              .tz(this.state.selectedTimezone)
              .format("YYYY-MM-DD") === e
        )
        .sort();
    });


    dateArrayTemp2.map((e) => {    
      slotArrayTemp[e].sort(function (a, b) {
      return new Date(a.start_date_time) - new Date(b.start_date_time);
    });
  })
    
    this.setState({
      slotArray: slotArrayTemp,
      dateArray: dateArrayTemp2,
    });
  }

  onResponse = (response, reqId) => {
    // this._hideLoader();
    switch (reqId) {
      case API_SEE_AVAILABILITY:
        this.setState(
          {
            dataAvailability: response.data.study.study_date_times,
            allocatedDateTimes: response.data.allocatedDateTimes,
          },
          () => {
            this.dateTimeChange();
          }
        );
        break;

      case API_ADD_REVIEW:
        Modal.success({
          title: "Thank you!",
          centered: "true",
          icon: "none",
          content: <p>Review successfully Added.</p>,
          maskClosable: "true",
          width: "350px",
          maskStyle: { backgroundColor: "rgba(0, 39, 102, 0.7)" },
          className: "info_modal_normal custom_header_color",
          onOk() {},
        });
        this.props.onCompleted && this.props.onCompleted();
        break;

      case API_SCHEDULE_INTERVIEW:
        Modal.success({
          title: "Thank you!",
          centered: "true",
          icon: "none",
          content: (
            <p>
              Your interview is rescheduled on&nbsp;
              {moment
                .utc(
                  `${this.state.interviewDate} ${this.state.interviewTime}`,
                  "YYYY-MM-DD HH:mm:ss"
                )
                .tz(this.state.selectedTimezone)
                .format("MMMM Do")}
              &nbsp;at&nbsp;
              {moment
                .utc(
                  `${this.state.interviewDate} ${this.state.interviewTime}`,
                  "YYYY-MM-DD HH:mm:ss"
                )
                .tz(this.state.selectedTimezone)
                .format("hh:mm A")}
              &nbsp;({this.state.timezoneName}).
            </p>
          ),
          maskClosable: "true",
          width: "350px",
          maskStyle: { backgroundColor: "rgba(0, 39, 102, 0.7)" },
          className: "info_modal_normal custom_header_color",
          onOk() {},
        });
        this.props.onCompleted && this.props.onCompleted();
        break;
      case API_RESCHEDULE_INTERVIEW:
        Modal.success({
          title: "Thank you!",
          centered: "true",
          icon: "none",
          content: (
            <p>
              Your interview is rescheduled on&nbsp;
              {moment
                .utc(
                  `${this.state.interviewDate} ${this.state.interviewTime}`,
                  "YYYY-MM-DD HH:mm:ss"
                )
                .tz(this.state.selectedTimezone)
                .format("MMMM Do")}
              &nbsp;at&nbsp;
              {moment
                .utc(
                  `${this.state.interviewDate} ${this.state.interviewTime}`,
                  "YYYY-MM-DD HH:mm:ss"
                )
                .tz(this.state.selectedTimezone)
                .format("hh:mm A")}
              &nbsp;({this.state.timezoneName}).
            </p>
          ),
          maskClosable: "true",
          width: "350px",
          maskStyle: { backgroundColor: "rgba(0, 39, 102, 0.7)" },
          className: "info_modal_normal custom_header_color",
          onOk() {},
        });
        this.setState({ interviewNote: null, rescheduleReason: null });
        this.props.onCompleted && this.props.onCompleted();
        break;
      case API_CANCEL_INTERVIEW:
        Modal.success({
          title: "Thank you!",
          centered: "true",
          icon: "none",
          maskStyle: { backgroundColor: "rgba(0, 39, 102, 0.7)" },
          content: <p>Your interview has been canceld.</p>,
          maskClosable: "true",
          width: "350px",
          // maskStyle: { backgroundColor: "rgba(0, 39, 102, 0.7)" },
          className: "info_modal_normal custom_header_color",
          onOk() {},
        });
        this.props.onCompleted && this.props.onCompleted();
        break;

      case API_TIME_ZONE:
        this.setState({
          timezoneList: response.data.timezone,
        });
        break;
      default:
        break;
    }
  };

  onError = (response, reqId) => {
    switch (reqId) {
      case API_SEE_AVAILABILITY:
        notification.error({
          message: response.meta.message,
        });
      case API_ADD_REVIEW:
        notification.error({
          message: response.meta.message,
        });
        break;

      case API_SCHEDULE_INTERVIEW:
        notification.error({
          message: response.meta.message,
        });
        break;
      case API_CANCEL_INTERVIEW:
        notification.error({
          message: response.meta.message,
        });
        break;
      case API_RESCHEDULE_INTERVIEW:
        notification.error({
          message: response.meta.message,
        });
        break;
      case API_TIME_ZONE:
        notification.error({
          message: response.meta.message,
        });
        break;
      default:
        break;
    }
  };

  handleRatingChange = (rating) => {
    this.setState({ rating: rating });
  };

  handleReviewChange = (e) => {
    this.setState({
      review: e.target.value,
    });
  };

  render() {
    const {
      visible1,
      visible2,
      dataAvailability,
      name,
      visible_submit_review,
      rating,
      review,
      reviewData,
      timezoneName,
      rescheduleReason,
      visibleReschedule,
      visibleCancelM,
      interviewTime,
      interviewDate,
      allocatedDateTimes,
      selectedSlot,
      interviewTimezone,
      interviewNote,
      interviewStaus,
      timezoneList,
      selectedTimezone,
      dateArray,
      slotArray,
    } = this.state;
    const { studyDetail, studyStatus } = this.props;
    return (
      <div>
        {studyDetail && studyStatus !== undefined ? (
          <div>
            {studyStatus === 0 ? (
              <Row
                type="flex"
                justify="center"
                style={{
                  padding: "20px 20px",
                  boxShadow: "0px 0 10px 0 rgba(0, 0, 0, 0.5)",
                  bottom: 0,
                  width: "100%",
                  margin: 0,
                }}
                gutter={[16, 16]}
                className="bg_white"
              >
                <Col className="text_center">
                  <span className="text_large text_semibold">
                    Please Fill Out The Additional Screener Questions For A
                    Study
                  </span>
                </Col>
                <Col className="text_center">
                  <Button
                    type="primary"
                    style={{ margin: "0 15px 10px 0" }}
                    className="link_button bg-blue"
                    onClick={(e) =>
                      this.enterScreener(e, studyDetail.survey_monkey_link)
                    }
                  >
                    Enter Screener
                  </Button>
                  <Button
                    className="link_button bg-white"
                    style={{ margin: "0 15px 10px 0" }}
                    onClick={() => this.showModal(studyStatus)}
                  >
                    See Availability
                  </Button>
                </Col>
              </Row>
            ) : studyStatus === 1 ? (
              <Row
                type="flex"
                justify="center"
                style={{
                  padding: "20px 0",
                  boxShadow: "0px 0 10px 0 rgba(0, 0, 0, 0.5)",
                  bottom: 0,
                  width: "100%",
                  margin: 0,
                }}
                gutter={[16, 16]}
                className="bg_white"
              >
                <Col
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {interviewStaus === null || interviewStaus === 3 ? (
                    <span className="text_large text_semibold text_right">
                      Schedule your interview?
                    </span>
                  ) : (
                    <div>
                      <p className="text_center" style={{ marginBottom: 0 }}>
                        Interview scheduled on:
                      </p>
                      <p
                        className="text_semibold text_large text_right text_app_color"
                        style={{ marginBottom: 0 }}
                      >
                        {moment
                          .utc(
                            `${studyDetail.schedule_date.date} ${studyDetail.schedule_date.time}`
                          )
                          .tz(studyDetail.schedule_date.timezone.timezone)
                          .format("MM/DD/YYYY hh:mm A")}
                        &nbsp;({studyDetail.schedule_date.timezone.code})
                      </p>
                    </div>
                  )}
                </Col>
                <Col>
                  {interviewStaus === null || interviewStaus === 3 ? (
                    <div>
                      <Button
                        type="primary"
                        className="link_button bg-blue"
                        onClick={() => this.showModal(studyStatus)}
                      >
                        See Availability
                      </Button>
                    </div>
                  ) : (
                    <div className="text_center">
                      <Button
                        className="link_button bg_app_color text_white bg-blue"
                        type="primary"
                        ghost
                        style={{
                          border: "none",
                          margin: "0 15px 10px 0",
                        }}
                        onClick={() => this.showModal(studyStatus)}
                      >
                        Reschedule
                      </Button>
                      <Button
                        className="link_button bg-white"
                        style={{ margin: "0 15px 10px 0" }}
                        onClick={() => this.cancelSchedule()}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            ) : (
              <Row
                type="flex"
                justify="center"
                style={{
                  padding: "20px 0",
                  boxShadow: "0px 0 10px 0 rgba(0, 0, 0, 0.5)",
                  bottom: 0,
                  width: "100%",
                  margin: 0,
                }}
                className="bg_white"
                gutter={[16, 16]}
              >
                {reviewData !== null ? (
                  <>
                    <Col
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span className="text_large text_semibold text_center">
                        View your submited Experience Review:
                      </span>
                    </Col>
                    <Col>
                      <div>
                        <Button
                          // className="link_button"
                          type="primary"
                          className="link_button bg-blue"
                          onClick={() =>
                            this.showSubmitedReview(studyDetail.name)
                          }
                        >
                          View Review
                        </Button>
                      </div>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span className="text_large text_semibold">
                        How was your overall experience?
                      </span>
                    </Col>
                    <Col>
                      <div>
                        <Button
                          // className="link_button"
                          type="primary"
                          className="link_button bg-blue"
                          style={{ margin: "0 15px 10px 0" }}
                          onClick={() => this.showModal2(studyDetail.name)}
                        >
                          Write Review
                        </Button>
                      </div>
                    </Col>
                  </>
                )}
              </Row>
            )}
          </div>
        ) : null}

        <Radio.Group onChange={this.onChange} style={{ display: "block" }}>
          <Modal
            visible={this.state.visible}
            // onOk={this.handleOk}
            onCancel={this.handleCancel}
            width="80%"
            footer={null}
            maskClosable={false}
            maskStyle={{ backgroundColor: "rgba(0, 39, 102, 0.7)" }}
            centered
            className="radio_timezone"
          >
            <Row type="flex" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
              <Col xs={{ span: 18 }} sm={{ span: 18 }} lg={{ span: 6 }}>
                <span className="text_app_color text_large">
                  Available Interview Times
                </span>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 8 }}>
                <DatePicker
                  onChange={this.onChangeDate}
                  placeholder="Search by date"
                  style={{ width: "100%" }}
                  format="MM/DD/YYYY"
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 8 }}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Timezone"
                  optionFilterProp="children"
                  onChange={this.changeTimeZone}
                  // defaultValue={
                  //   interviewStaus === 1 || interviewStaus === 2
                  //     ? studyDetail.schedule_date.timezone.timezone
                  //     : selectedTimezone
                  // }
                  defaultValue={selectedTimezone}
                >
                  {timezoneList.map((timezone, t_index) => (
                    <Option
                      value={timezone.timezone}
                      title={timezone.name}
                      index={t_index}
                    >
                      {timezone.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row
              className="bg_gray-1"
              type="flex"
              align="middle"
              style={{
                padding: "5px 0",
                marginBottom: "15px",
                marginTop: "10px",
              }}
            >
              <Col
                xs={{ span: 6 }}
                sm={{ span: 6 }}
                md={{ span: 6 }}
                lg={{ span: 3 }}
                className="text_center"
              >
                <Text className="text_app_color text_normal">Dates</Text>
              </Col>
              <Col
                xs={{ span: 18 }}
                sm={{ span: 18 }}
                md={{ span: 18 }}
                lg={{ span: 21 }}
              >
                <Text
                  className="text_app_color text_normal"
                  style={{ paddingLeft: "20px" }}
                >
                  Available times
                </Text>
              </Col>
            </Row>
            <div className="radio_timezone_body">
              {dateArray.map((date, date_index) => (
                <Row type="flex" key={{ date_index }}>
                  {moment
                    .tz(date, this.state.selectedTimezone)
                    .utc()
                    .diff(moment().utc().format("YYYY-MM-DD"), "d") >= 0 ? (
                    <>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        lg={{ span: 3 }}
                        className="text_center time_wrapper"
                      >
                        <span
                          className="text_app_color text_normal"
                          style={{ display: "block" }}
                        >
                          {moment(date, "YYYY-MM-DD").format("MM/DD/YYYY")}
                        </span>
                        <span className="text_gray-4 text_medium">
                          {moment(date, "YYYY-MM-DD").format("dddd")}
                        </span>
                      </Col>
                      
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        lg={{ span: 21 }}
                      >
                        <div className="btn_wrapper">
                          {slotArray[date].map((e) => (
                            <Radio.Button
                              checked={false}
                              value={`${e.id} ${moment
                                .utc(e.start_date_time, "YYYY-MM-DD HH:mm:ss")
                                .format("YYYY-MM-DD HH:mm:ss")}`}
                              disabled={
                                allocatedDateTimes.findIndex(
                                  (element) =>
                                    element.date_time ===
                                    moment
                                      .utc(
                                        e.start_date_time,
                                        "YYYY-MM-DD HH:mm:ss"
                                      )
                                      .format("YYYY-MM-DD HH:mm:ss")
                                ) !== -1
                              }
                            >
                              {moment
                                .utc(e.start_date_time, "YYYY-MM-DD HH:mm:ss")
                                .tz(this.state.selectedTimezone)
                                .format("hh:mm A")}
                            </Radio.Button>
                          ))}
                          {/* {this.timeSloat(
                            // dates.id,
                            // dates.date,
                            // dates.start_time,
                            // dates.end_time,
                            // dates.slot,
                            date,
                            allocatedDateTimes,
                            slotArray
                            // dates.start_date_time,
                            // dates.end_date_time
                          )} */}
                        </div>
                      </Col>
                    </>
                  ) : null}
                </Row>
              ))}
            </div>

            <Row>
              <Col span={24} className="radio_timezone_footer">
                {this.state.status === 1 ? (
                  <div>
                    {interviewStaus === 1 || interviewStaus === 2 ? (
                      <Button
                        className="link_button"
                        type="primary"
                        style={{ width: "auto" }}
                        onClick={() => this.showRescheduleModal()}
                        disabled={selectedSlot === null ? true : false}
                      >
                        Reschedule interview
                      </Button>
                    ) : (
                      <Button
                        className="link_button"
                        type="primary"
                        style={{ width: "auto" }}
                        onClick={() =>
                          this.showModal1(
                            { uuid: this.state.studyId },
                            dataAvailability
                          )
                        }
                        disabled={selectedSlot === null ? true : false}
                      >
                        Schedule interview
                      </Button>
                    )}
                  </div>
                ) : (
                  // <Button
                  //   className="link_button"
                  //   type="primary"
                  //   style={{ width: "auto" }}
                  //   onClick={() => this.showModal1(dataAvailability)}
                  // >
                  //   Schedule interview
                  // </Button>

                  <Button
                    className="link_button"
                    type="primary"
                    onClick={() => this.closeModal()}
                  >
                    Ok
                  </Button>
                )}
              </Col>
            </Row>
          </Modal>
        </Radio.Group>
        {/* schedule interview modal */}
        <Modal
          visible={visible1}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          maskStyle={{ backgroundColor: "rgba(0, 39, 102, 0.7)" }}
          centered
          title="Schedule an Interview"
          className="radio_timezone custom_header_color"
        >
          <Row
            type="flex"
            align="middle"
            gutter={[16, { xs: 8, sm: 16, md: 24, lg: 16 }]}
          >
            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 7 }}>
              Interview Date:
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 17 }}>
              <p style={{ marginBottom: 0 }}>
                {interviewDate &&
                  interviewTime &&
                  moment
                    .utc(
                      `${interviewDate} ${interviewTime}`,
                      "YYYY-MM-DD HH:mm:ss"
                    )
                    .tz(selectedTimezone)
                    .format("MM/DD/YYYY")}
              </p>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 7 }}>
              Timezone:
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 17 }}>
              <p style={{ marginBottom: 0 }}>{timezoneName}</p>
            </Col>

            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 7 }}>
              Interview Time:
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 17 }}>
              <p style={{ marginBottom: 0 }}>
                {interviewDate &&
                  interviewTime &&
                  moment
                    .utc(
                      `${interviewDate} ${interviewTime}`,
                      "YYYY-MM-DD HH:mm:ss"
                    )
                    .tz(selectedTimezone)
                    .format("hh:mm A")}
              </p>
            </Col>
          </Row>

          <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 16 }]}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
              Add Additional note:
              <div>
                <TextArea
                  rows={3}
                  onChange={(e) => {
                    this.setState({
                      interviewNote: e.target.value,
                    });
                  }}
                  value={this.state.interviewNote}
                  placeholder="E. g. - call me at a different number than is in my profile, call my admin, call me with reminder 5 min before."
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col
              span={24}
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="primary"
                onClick={() =>
                  this.scheduleInterview(
                    interviewDate,
                    interviewTime,
                    interviewNote
                  )
                }
                // disabled={interviewNote <= 0 ? true : false}
                style={{ marginRight: "10px" }}
              >
                Schedule
              </Button>

              <Button onClick={this.handleBack}>Interview Dates</Button>
            </Col>
          </Row>
        </Modal>

        {/* reschedule interview modal */}
        <Modal
          visible={visibleReschedule}
          onCancel={this.handleCancel}
          footer={null}
          maskStyle={{ backgroundColor: "rgba(0, 39, 102, 0.7)" }}
          maskClosable={false}
          centered
          title="Reschedule an Interview"
          className="radio_timezone custom_header_color"
        >
          <Row
            type="flex"
            align="middle"
            gutter={[16, { xs: 8, sm: 16, md: 24, lg: 16 }]}
          >
            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 7 }}>
              Interview Date:
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 17 }}>
              <p style={{ marginBottom: 0 }}>
                {interviewDate &&
                  interviewTime &&
                  moment
                    .utc(
                      `${interviewDate} ${interviewTime}`,
                      "YYYY-MM-DD HH:mm:ss"
                    )
                    .tz(selectedTimezone)
                    .format("MM/DD/YYYY")}
              </p>
            </Col>

            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 7 }}>
              Timezone:
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 17 }}>
              <p style={{ marginBottom: 0 }}>{timezoneName}</p>
            </Col>

            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 7 }}>
              Interview Time:
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 17 }}>
              <p style={{ marginBottom: 0 }}>
                {interviewDate &&
                  interviewTime &&
                  moment
                    .utc(
                      `${interviewDate} ${interviewTime}`,
                      "YYYY-MM-DD HH:mm:ss"
                    )
                    .tz(selectedTimezone)
                    .format("hh:mm A")}
              </p>
            </Col>
          </Row>

          <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 16 }]}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
              Reason for reschedule:
              <div>
                <TextArea
                  rows={3}
                  onChange={(e) => {
                    this.setState({
                      rescheduleReason: e.target.value,
                    });
                  }}
                  value={this.state.rescheduleReason}
                  placeholder="E. g. - call me at a different number than is in my profile, call my admin, call me with reminder 5 min before."
                />
              </div>
            </Col>
          </Row>

          <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 16 }]}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
              Add Additional note:
              <div>
                <TextArea
                  rows={3}
                  onChange={(e) => {
                    this.setState({
                      interviewNote: e.target.value,
                    });
                  }}
                  value={this.state.interviewNote}
                  placeholder="E. g. - call me at a different number than is in my profile, call my admin, call me with reminder 5 min before."
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col
              span={24}
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="primary"
                onClick={() =>
                  this.reScheduleInterview(
                    interviewDate,
                    interviewTime,
                    interviewNote,
                    rescheduleReason
                  )
                }
                disabled={rescheduleReason !== null ? false : true}
                style={{ marginRight: "10px" }}
              >
                Reschedule
              </Button>
              <Button onClick={this.handleBack}>Interview Dates</Button>
            </Col>
          </Row>
        </Modal>

        {/* cancel interview modal */}
        <Modal
          title="Cancel an Interview"
          visible={visibleCancelM}
          maskClosable={false}
          // onOk={this.scheduleInterview}
          maskStyle={{ backgroundColor: "rgba(0, 39, 102, 0.7)" }}
          onCancel={this.handleCancel}
          // width="50%"
          footer={null}
          centered
          className="radio_timezone custom_header_color"
        >
          <Row
            type="flex"
            // gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          >
            <Col span={24}>
              <div>
                <span className="text_app_color text_large text_semibold">
                  Are You Sure?
                </span>
                <p>
                  If there is anything we can do to accommodate you, please let
                  us know.
                </p>
              </div>
              <div style={{ margin: "1em 0" }}>
                <span>Reason for cancellation:</span>

                <TextArea
                  onChange={(e) => {
                    this.setState({
                      cancelReason: e.target.value,
                    });
                  }}
                  rows={3}
                  placeholder="E. g. - call me at a different number than is in my profile, call my admin, call me with reminder 5 min before."
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={24} className="radio_timezone_footer">
              <Button
                className="link_button"
                type="primary"
                style={{ width: "auto", marginRight: "10px" }}
                onClick={() => this.cancelSchedule1()}
                disabled={this.state.cancelReason !== null ? false : true}
              >
                Yes
              </Button>
              <Button
                className=""
                // type="primary"
                style={{ width: "auto" }}
                onClick={() => this.handleCancel()}
              >
                No
              </Button>
            </Col>
          </Row>
        </Modal>

        {/* write review */}
        <Modal
          title="Write Review"
          visible={visible2}
          // onOk={this.scheduleInterview}
          onCancel={this.handleCancel}
          // width="50%"
          footer={null}
          maskStyle={{ backgroundColor: "rgba(0, 39, 102, 0.7)" }}
          maskClosable={false}
          centered
          className="radio_timezone custom_header_color"
        >
          <Row
            type="flex"
            // gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          >
            <Col span={24}>
              <div>
                <span className="text_app_color text_large">{name}</span>
              </div>
              <div style={{ marginTop: "1em" }}>
                <span>Rate your overall experience with this study:</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Rate
                  className="review_icon"
                  character={<i className="icon-star-fill" />}
                  style={{
                    fontSize: 36,
                    color: "#002766",
                    margin: 0,
                  }}
                  allowHalf
                  onChange={this.handleRatingChange}
                  value={rating}
                />
                <span className="text_app_color" style={{ fontSize: "35px" }}>
                  {rating < 0 ? 0 : rating}
                </span>
              </div>
              <div style={{ margin: "1em 0" }}>
                <span>
                  Please provide a few details describing your experience with
                  our team:
                </span>
              </div>
              <div>
                <TextArea
                  onChange={this.handleReviewChange}
                  rows={3}
                  placeholder="add review note here"
                  value={review}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={24} className="radio_timezone_footer">
              <Button
                className="link_button"
                type="primary"
                style={{ width: "auto", marginRight: "10px" }}
                onClick={() => this.addReview()}
                disabled={rating < 0 ? true : false}
              >
                Submit
              </Button>
              <Button
                className=""
                // type="primary"
                style={{ width: "auto" }}
                onClick={() => this.handleCancel()}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Modal>

        <Modal
          title="View Review"
          visible={visible_submit_review}
          maskClosable={false}
          maskStyle={{ backgroundColor: "rgba(0, 39, 102, 0.7)" }}
          // onOk={this.scheduleInterview}
          onCancel={this.handleCancel}
          // width="50%"
          footer={null}
          centered
          className="radio_timezone custom_header_color"
        >
          <Row
            type="flex"
            // gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          >
            {reviewData && (
              <Col span={24}>
                <div>
                  <span className="text_app_color text_large">{name}</span>
                </div>
                <div style={{ marginTop: "1em" }}>
                  <span>Your rating of this study:</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Rate
                    className="review_icon"
                    character={<i className="icon-star-fill" />}
                    style={{
                      fontSize: 36,
                      color: "#002766",
                      margin: 0,
                    }}
                    disabled
                    allowHalf
                    defaultValue={reviewData !== null && reviewData.rate}
                  />
                  <span className="text_app_color" style={{ fontSize: "35px" }}>
                    {reviewData !== null && reviewData.rate}
                  </span>
                </div>
                <div style={{ margin: "1em 0" }}>
                  <span>Your experience with our team:</span>
                </div>
                <div>
                  <p>{reviewData !== null && reviewData.details}</p>
                </div>
              </Col>
            )}
          </Row>

          <Row>
            <Col span={24} className="radio_timezone_footer">
              <Button
                className="link_button"
                type="primary"
                style={{ width: "auto" }}
                onClick={() => this.handleCancel()}
              >
                Ok
              </Button>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(DetailFooter);
