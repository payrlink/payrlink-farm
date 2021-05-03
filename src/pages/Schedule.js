/* eslint-disable array-callback-return */
/* eslint-disable no-fallthrough */
/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import {
  Row,
  Col,
  Typography,
  Modal,
  notification,
  Button,
  Radio,
  DatePicker,
  Select,
  Switch,
  Input,
} from "antd";
import { Helmet } from "react-helmet";
import { setUser } from "../redux/action";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  APIRequest,
  API_MY_APPOINTMENTS,
  API_SEE_AVAILABILITY,
  API_CANCEL_INTERVIEW,
  API_RESCHEDULE_INTERVIEW,
  API_TIME_ZONE,
  API_GOOGLE_SYNC_ON,
  API_GOOGLE_SYNC_OFF,
} from "../api";
import { connect } from "react-redux";
import { GoogleLogin } from "react-google-login";
import moment from "moment";
import { Link } from "react-router-dom";
import Logo from "../assets/images/btn_google_light.svg";

const { Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;

export class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      calendarWeekends: true,
      calendarEvents: [],

      eventName: null,
      eventStart: null,
      study_id: null,

      visible: false,
      visible1: false,

      visible2: false,
      eventModal: false,
      dataAvailability: [],
      allocatedDateTimes: [],
      studyId: "",
      searchDate: "",
      rating: -1,
      review: "",
      name: "",
      selectedSlot: null,
      status: 0,
      study_info: [],
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
      selectedTimezone: null,
      userTimezone: null,
      googleSync: "",
      slotArray: {},
      dateArray: [],
      googleSyncToggle: null,
      googleSwitch: null,
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

  componentDidMount() {
    this.setState({
      selectedTimezone:
        this.props.user.user_timezone && this.props.user.user_timezone.timezone,
      userTimezone:
        this.props.user.user_timezone && this.props.user.user_timezone,
      timezoneName:
        this.props.user.user_timezone && this.props.user.user_timezone.name,
      googleSync: this.props.user && this.props.user.is_google_sync,
    });

    new APIRequest.Builder()
      .get()
      .setReqId(API_MY_APPOINTMENTS)
      .reqURL("/schedule")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
    this.fetchTimeZone();
  }

  changeTimeZone = (value, title) => {
    this.setState(
      {
        selectedTimezone: value,
        timezoneName: title.props.children,
      },
      () => {
        this.avaibility();
      }
    );
  };
  closeModal = (e) => {
    this.setState({
      visible: false,
    });
  };

  showRescheduleModal = () => {
    this.setState({
      visibleReschedule: true,
      visible: false,
    });
  };

  handleBack = (e) => {
    this.setState({
      visible: true,
      visible1: false,
      visible2: false,
      visibleReschedule: false,
    });
  };

  changeSwitch = (e) => {
    console.log(e);
    if (e === false) {
      this.syncOff();
    }
    this.setState({
      googleSwitch: e,
    });
  };

  syncOff() {
    this.setState({
      googleSync: 0,
    });
    new APIRequest.Builder()
      .post()
      .setReqId(API_GOOGLE_SYNC_OFF)
      .reqURL("/user-google-sync")
      .jsonParams({
        is_google_sync: 0,
      })
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
  }

  syncOn = () => {
    new APIRequest.Builder()
      .post()
      .setReqId(API_GOOGLE_SYNC_ON)
      .reqURL("/google/auth/code")
      .jsonParams({
        code: this.state.google_auth_code,
        user_id: this.props.user.id,
      })
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
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
    });

    this.setState({
      slotArray: slotArrayTemp,
      dateArray: dateArrayTemp2,
    });
  }

  onResponse = (response, reqId) => {
    switch (reqId) {
      case API_MY_APPOINTMENTS:
        this.setState(
          {
            data: response.data.schedules,
            googleSyncToggle: response.meta.google_sync,
          },
          () => {
            let temp = response.data.schedules.map((schedules) => {
              return {
                ...schedules,
                title: schedules.study.name,
                start: moment
                  .utc(schedules.date_time, "YYYY-MM-DD HH:mm:ss")
                  .tz(this.state.selectedTimezone)
                  .format("YYYY-MM-DD HH:mm:ss"),
                backgroundColor: "#002766",
                borderColor: "#002766",
                studyDetail: schedules.study,
              };
            });

            this.setState({
              calendarEvents: temp,
            });
          }
        );
        break;
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
      case API_CANCEL_INTERVIEW:
        // this.props.onCompleted && this.props.onCompleted();
        break;

      case API_RESCHEDULE_INTERVIEW:
        Modal.success({
          title: "Thank you!",
          centered: "true",
          icon: "none",
          content: <p>Your interview is rescheduled successfully.</p>,
          maskClosable: "true",
          width: "350px",
          maskStyle: { backgroundColor: "rgba(0, 39, 102, 0.7)" },
          className: "info_modal_normal custom_header_color",
          onOk() {},
        });
        this.setState({ interviewNote: null, rescheduleReason: null });
        // this.props.onCompleted && this.props.onCompleted();
        break;

      case API_TIME_ZONE:
        this.setState({
          timezoneList: response.data.timezone,
        });
        break;
      case API_GOOGLE_SYNC_ON:
        this.setState(
          {
            googleSync: 1,
          },
          () => {
            this.props.setUser(response.data.user);
          }
        );
        break;

      case API_GOOGLE_SYNC_OFF:
        this.setState(
          {
            googleSync: 0,
          },
          () => {
            this.props.setUser(response.data.user);
          }
        );
        break;

      default:
        break;
    }
  };

  onError = (response, reqId) => {
    switch (reqId) {
      case API_MY_APPOINTMENTS:
        notification.error({
          message: response.meta.message,
        });
        break;
      case API_SEE_AVAILABILITY:
        notification.error({
          message: response.meta.message,
        });
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
      case API_GOOGLE_SYNC_ON:
        notification.error({
          message: response.meta.message,
        });
        break;

      case API_GOOGLE_SYNC_OFF:
        notification.error({
          message: response.meta.message,
        });
        break;
      default:
        break;
    }
  };

  calendarComponentRef = React.createRef();

  showEventModal = (studyName, startTime, studyData) => {
    this.setState({
      eventModal: true,
      eventName: studyName,
      eventStart: startTime,
      study_id: studyData.uuid,
      study_info: studyData,
    });
  };

  showAvailability = (dataAvailability) => {
    this.setState(
      {
        // status: status,
        eventModal: false,
        visible: true,
        studyId: this.state.study_id,
        // interviewStaus: e.schedule_date ? e.schedule_date.status : null
      },
      () => {
        this.avaibility(dataAvailability);
      }
    );
  };

  avaibility = (e) => {
    new APIRequest.Builder()
      .post()
      .setReqId(API_SEE_AVAILABILITY)
      .jsonParams({
        study_id: this.state.study_id,
        date: this.state.searchDate,
      })
      .reqURL("/see-availability")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
      visible1: false,
      visible2: false,
      visibleReschedule: false,
      selectedSlot: null,
      visibleCancelM: false,
      eventModal: false,
    });
  };

  reScheduleInterview = (date, time, interviewNote, reason) => {
    new APIRequest.Builder()
      .post()
      .setReqId(API_RESCHEDULE_INTERVIEW)
      .jsonParams({
        study_id: this.state.study_id,
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
      eventModal: false,
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

  timeSloat = (
    id,
    date,
    start_time,
    end_time,
    slot,
    allocatedSlot,
    start_date_time,
    end_date_time
  ) => {
    let startTime = moment(start_time, "hh:mm A").format("hh:mm A");
    let endTime = moment(end_time, "hh:mm A").format("hh:mm A");

    let startTimeTz = moment
      .utc(start_date_time, "YYYY-MM-DD HH:mm:ss")
      .tz(this.state.selectedTimezone)
      .format("YYYY-MM-DD HH:mm:ss");
    let endTimeTz = moment
      .utc(end_date_time, "YYYY-MM-DD HH:mm:ss")
      .tz(this.state.selectedTimezone)
      .format("YYYY-MM-DD HH:mm:ss");

    // calculate total duration
    let duration = moment(endTimeTz, "YYYY-MM-DD HH:mm:ss").diff(
      moment(startTimeTz, "YYYY-MM-DD HH:mm:ss"),
      "hours"
    );

    let allTimes = [];
    let endTimeNull = moment(startTimeTz, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    // for 30 minutes
    if (slot === 30) {
      allTimes.push(
        moment(startTimeTz, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
      );
      for (let i = 0; i < duration * 2; ++i) {
        endTimeNull = moment(endTimeNull, "YYYY-MM-DD HH:mm:ss")
          .add(30, "minutes")
          .format("YYYY-MM-DD HH:mm:ss");
        allTimes.push(
          moment(endTimeNull, "YYYY-MM-DD HH:mm:ss").format(
            "YYYY-MM-DD HH:mm:ss"
          )
        );
      }

      // allTimes.pop(endTime);
      let lastTimeHalf = allTimes.find((element) => element === endTimeTz);
      lastTimeHalf && allTimes.pop(lastTimeHalf);
    }
    // for 60 minutes
    else if (slot === 60) {
      allTimes.push(
        moment(startTimeTz, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
      );
      for (let i = 0; i < duration; i++) {
        endTimeNull = moment(endTimeNull, "YYYY-MM-DD HH:mm:ss")
          .add(60, "minutes")
          .format("YYYY-MM-DD HH:mm:ss");
        allTimes.push(
          moment(endTimeNull, "YYYY-MM-DD HH:mm:ss").format(
            "YYYY-MM-DD HH:mm:ss"
          )
        );
      }

      let lastTimeFull = allTimes.find((element) => element === endTimeTz);
      lastTimeFull && allTimes.pop(lastTimeFull);
    }

    return allTimes.map((timeValue, index) => {
      return (
        moment
          .tz(timeValue, this.state.selectedTimezone)
          .utc()
          .format("YYYY-MM-DD HH:mm:ss") >
          moment.utc().format("YYYY-MM-DD HH:mm:ss") && (
          <Radio.Button
            checked={false}
            value={`${id} ${moment
              .tz(timeValue, this.state.selectedTimezone)
              .utc()
              .format("YYYY-MM-DD HH:mm:ss")} ${index}`}
            disabled={
              allocatedSlot.findIndex(
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

    // return allTimes.map((value, index) => (
    //   <Radio.Button value={`${id} ${date} ${value} ${index}`}>
    //     {value}
    //   </Radio.Button>
    // ));
  };

  cancelSchedule = () => {
    this.setState({
      studyId: this.state.studyId,
      visibleCancelM: true,
      eventModal: false,
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

  cancelSchedule1 = () => {
    new APIRequest.Builder()
      .post()
      .setReqId(API_CANCEL_INTERVIEW)
      .jsonParams({
        study_id: this.state.study_id,
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

  render() {
    const {
      dataAvailability,
      selectedSlot,
      rescheduleReason,
      visibleReschedule,
      visibleCancelM,
      interviewTime,
      interviewDate,
      allocatedDateTimes,
      interviewTimezone,
      interviewNote,
      interviewStaus,
      googleSync,
      timezoneList,
      selectedTimezone,
      eventModal,
      userTimezone,
      calendarEvents,
      study_info,
      timezoneName,
      eventStart,
      dateArray,
      slotArray,
      googleSyncToggle,
    } = this.state;

    const responseGoogle = (response) => {
      this.setState(
        {
          google_auth_code: response.code,
        },
        () => {
          this.syncOn();
        }
      );
    };

    const responseGoogleFail = (response) => {
      this.setState({
        googleSync: 0,
      });
    };
    return (
      <div>
        <Helmet>
          <title>My Schedule</title>
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
              justify="space-between"
              align="middle"
              style={{
                borderBottom: "1px solid #D9D9D9",
                paddingBottom: "1em",
                marginBottom: "1.5em",
              }}
            >
              <Col span={12}>
                <Text className="text_app_color text_semibold text_large">
                  My Appointments
                </Text>
              </Col>
              <Col>
                <div>
                  <div className="text_right">
                    Google Calendar Synchronization:{" "}
                    <Switch
                      size="small"
                      defaultChecked={this.props.user.is_google_sync}
                      onChange={this.changeSwitch}
                      disabled={!googleSyncToggle}
                    />
                    {googleSyncToggle !== null && googleSyncToggle !== true && (
                      <div className="text_small text_gray-3">
                        <span>
                          Please note: Google calendar sync is currently not
                          available at this time
                        </span>
                      </div>
                    )}
                  </div>
                  {this.state?.googleSwitch === true ? (
                    <>
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <GoogleLogin
                          clientId="414199445799-fq0aidd59lqb3o4qok9ig36qiqu7r9ad.apps.googleusercontent.com"
                          // clientId="180906460570-nocc9surh3gb91osuoi0im8r4urhqghd.apps.googleusercontent.com"
                          scope="https://www.googleapis.com/auth/calendar"
                          accessType="offline"
                          responseType="code"
                          prompt="consent"
                          onSuccess={responseGoogle}
                          onFailure={responseGoogleFail}
                          disabled={!googleSyncToggle}
                          icon={false}
                          className="google_login_button"
                        >
                          <img
                            src={Logo}
                            style={{
                              height: "40px"
                            }}
                            alt="logo"
                          />
                          <span className="roboto_text">
                            Login with Google
                          </span>
                        </GoogleLogin>
                      </div>
                    </>
                  ) : null}
                </div>
              </Col>
            </Row>
            <div
              style={{
                marginTop: "2.5em",
                padding: "1.5em 1em",
                borderTop: "3px solid #63B5FA",
              }}
            >
              <FullCalendar
                defaultView="dayGridMonth"
                header={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                ref={this.calendarComponentRef}
                weekends={true}
                events={calendarEvents}
                eventClick={(info) => {
                  this.showEventModal(
                    info.event.title,
                    info.event.start,
                    info.event.extendedProps.studyDetail
                  );
                }}
              />
            </div>
          </Col>
        </Row>

        <Footer />

        <Modal
          title={`Interview on ${moment(eventStart).format(
            "MM/DD/YYYY"
          )} at ${moment(eventStart).format("hh:mm A")} (${
            userTimezone !== null && userTimezone.code
          }) - You will be called
          directly on the phone number provided`}
          visible={eventModal}
          maskClosable={false}
          // onOk={this.scheduleInterview}
          onCancel={this.handleCancel}
          // width="50%"
          footer={null}
          centered
          bodyStyle={{ padding: 0 }}
          className="radio_timezone custom_header_color"
        >
          <Row type="flex">
            <Col span={24}>
              <div
                style={{ padding: "12px 24px" }}
                className="text_white bg_app_color_light"
              >
                <p style={{ marginBottom: 0 }}>
                  {study_info && study_info.name}
                </p>
              </div>
              <div style={{ padding: "12px 24px" }}>
                <p style={{ marginBottom: 0 }} className="text_red">
                  NOTE: In case of any issues, contact your project manager
                  below
                </p>
              </div>
            </Col>
            <Col span={24} style={{ padding: "0px 24px" }}>
              <table>
                <tr>
                  <td className="text_gray-3" style={{ paddingRight: "10px" }}>
                    Project manager:
                  </td>
                  <td>
                    {`${study_info.user && study_info.user.first_name} ${
                      study_info.user && study_info.user.last_name
                    }`}
                  </td>
                </tr>
                <tr>
                  <td className="text_gray-3" style={{ paddingRight: "10px" }}>
                    Phone number:
                  </td>
                  <td>{study_info.user && study_info.user.phone_no}</td>
                </tr>
                <tr>
                  <td className="text_gray-3" style={{ paddingRight: "10px" }}>
                    Email address:
                  </td>
                  <td>{study_info.user && study_info.user.email}</td>
                </tr>
              </table>
            </Col>
          </Row>

          <Row type="flex" align="middle">
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 10 }}
              style={{ padding: "16px 24px" }}
            >
              <Link
                to={`/study/${this.state.study_id}/detail`}
                className="text_app_color_light"
              >
                View Details
              </Link>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 14 }}
              style={{ padding: "16px 24px" }}
            >
              <div style={{ float: "right" }}>
                <Button
                  className="link_button"
                  type="primary"
                  style={{ width: "auto", marginRight: "10px" }}
                  onClick={() => this.showAvailability()}
                >
                  Reschedule
                </Button>
                <Button
                  className=""
                  // type="primary"
                  style={{ width: "auto" }}
                  onClick={() => this.cancelSchedule()}
                >
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
        </Modal>

        {/* see availablity modal */}
        <Radio.Group onChange={this.onChange}>
          <Modal
            visible={this.state.visible}
            // onOk={this.handleOk}
            onCancel={this.handleCancel}
            width="80%"
            maskClosable={false}
            footer={null}
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
                  defaultValue={selectedTimezone}
                >
                  {timezoneList.map((timezone, t_index) => (
                    <Option value={timezone.timezone} index={t_index}>
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

            {/* <div className="radio_timezone_body">
              {dataAvailability.map((dates, date_index) => (
                <Row type="flex" key={{ date_index }}>
                  {moment(dates.date, "YYYY-MM-DD").format("MM/DD/YYYY") >=
                  moment().format("MM/DD/YYYY") ? (
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
                          {moment(dates.date, "YYYY-MM-DD").format(
                            "MM/DD/YYYY"
                          )}
                        </span>
                        <span className="text_gray-4 text_medium">
                          {moment(dates.date, "YYYY-MM-DD").format("dddd")}
                        </span>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        lg={{ span: 21 }}
                      >
                        <div className="btn_wrapper">
                          {this.timeSloat(
                            dates.id,
                            dates.date,
                            dates.start_time,
                            dates.end_time,
                            dates.slot,
                            allocatedDateTimes,
                            dates.start_date_time,
                            dates.end_date_time
                          )}
                        </div>
                      </Col>
                    </>
                  ) : null}
                </Row>
              ))}
            </div> */}

            <Row>
              <Col span={24} className="radio_timezone_footer">
                {/* {this.state.status === 1 ? ( */}
                <div>
                  <Button
                    className="link_button"
                    type="primary"
                    style={{ width: "auto" }}
                    onClick={() => this.showRescheduleModal()}
                    disabled={selectedSlot === null ? true : false}
                  >
                    Reschedule interview
                  </Button>
                </div>
              </Col>
            </Row>
          </Modal>
        </Radio.Group>

        {/* reschedule interview modal */}
        <Modal
          visible={visibleReschedule}
          onCancel={this.handleCancel}
          footer={null}
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
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
