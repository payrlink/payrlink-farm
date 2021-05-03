/* eslint-disable no-lone-blocks */
import React, { Component } from "react";
import { Steps, Button, Modal, Form, notification } from "antd";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import { setForm, resetForm } from "../../redux/action";
import { connect } from "react-redux";
import {
  API_REGISTER_QUESTION,
  API_STORE_REGISTER,
  API_EMAIL_CHECK,
  API_USER_ROLE_FETCH,
  APIRequest
} from "../../api";

const { Step } = Steps;

class Stepper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      data: [],
      timezone: [],
      final_response: {},
      finalData: "",
      redirect: false
    };
  }

  stepperQuestion = (role) => {
    
    new APIRequest.Builder()
      .get()
      .setReqId(API_REGISTER_QUESTION)
      .reqURL(`/get-sign-up-steps-list/${role}`)
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
  };


  componentDidMount() {
    this.stepperQuestion();
    new APIRequest.Builder()
      .get()
      .setReqId(API_USER_ROLE_FETCH)
      .reqURL("/user-role")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();

    this.props.resetForm(this.props);
  }

  onResponse = (response, reqId) => {
    // this._hideLoader();
    switch (reqId) {
      case API_REGISTER_QUESTION:
        this.setState({
          data: response.data.signupSteps,
          timezone: response.data.timeZone,
          speciality: response.data.Speciality
        });
        break;

      case API_USER_ROLE_FETCH:
        this.setState({
          userRole: response.data.userRole
        });
        break;

      case API_EMAIL_CHECK:
        this.next();
        break;

      case API_STORE_REGISTER:
        Modal.info({
          title: "Thank you!",
          centered: "true",
          icon: "none",
          content: (
            <p>
              Thank you for completing your profile! It has been sent for
              approval and you will be notified via email once it has been
              approved.
            </p>
          ),
          maskClosable: "true",
          width: "350px",
          maskStyle: { backgroundColor: "rgba(0, 39, 102, 0.7)" },
          className: "info_modal",
          // onOk() {}
          onOk: () => {
            this.props.resetForm(this.props);
            this.props.history.push("/");
          }
        });

        break;
      default:
        break;
    }
  };

  onError = (response, reqId) => {
    switch (reqId) {
      case API_STORE_REGISTER:
        notification.error({
          message: response.meta.message
        });
        break;
      case API_EMAIL_CHECK:
        notification.error({
          message: response.meta.message
        });
        break;

      case API_USER_ROLE_FETCH:
        notification.error({
          message: response.meta.message
        });
        break;
      default:
        break;
    }
  };

  check = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        Object.assign(this.props.form, fieldsValue);
        let response = {
          ...this.state.final_response,
          [`${this.state.current + 1}`]: fieldsValue
        };

        {
          fieldsValue.fixed_field !== undefined
            ? new APIRequest.Builder()
                .post()
                .setReqId(API_EMAIL_CHECK)
                .jsonParams({
                  email: fieldsValue.fixed_field.email,
                  phoneno: fieldsValue.fixed_field.phoneno
                })
                .reqURL("/emailCheck")
                .response(this.onResponse)
                .error(this.onError)
                .build()
                .doRequest()
            : this.next();
        }

        const finalObject = Object.assign({}, this.state.finalData, response);
        this.props.setForm(finalObject);

        this.setState({
          finalData: finalObject,
          redirect: true
        });
      } else {
        notification.error({
          message: "Please fill all the fields with Appropriate data."
        });
      }
    });
  };

  done = (e, props) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let response = {
          ...this.state.final_response,
          [`${this.state.current + 1}`]: fieldsValue
        };
        const finalObject = Object.assign({}, this.state.finalData, response);

        function toFormData(obj, form, namespace) {
          let fd = form || new FormData();
          let formKey;

          for (let property in obj) {
            if (obj.hasOwnProperty(property) && obj[property]) {
              if (namespace) {
                formKey = namespace + "[" + property + "]";
              } else {
                formKey = property;
              }

              // if the property is an object, but not a File, use recursivity.
              if (obj[property] instanceof Date) {
                fd.append(formKey, obj[property].toISOString());
              } else if (
                typeof obj[property] === "object" &&
                !(obj[property] instanceof File)
              ) {
                toFormData(obj[property], fd, formKey);
              } else {
                // if it's a string or a File object
                fd.append(formKey, obj[property]);
              }
            }
          }

          return fd;
        }

        this.setState(
          {
            finalData: finalObject
          },
          () => {
            let finalDArares = new APIRequest.Builder()
              .post()
              .setReqId(API_STORE_REGISTER);

            let object = this.state.finalData;

            finalDArares
              .reqURL("/register")
              .setParams(toFormData(object))
              .response(this.onResponse)
              .error(this.onError)
              .build()
              .doRequest();
          }
        );
      } else {
        notification.error({
          message: "Please fill all the required fields.!"
        });
      }
    });
  };

  previousStep = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      Object.assign(this.props.form, fieldsValue);
      let response = {
        ...this.state.final_response,
        [`${this.state.current + 1}`]: fieldsValue
      };
      this.prev();
      const finalObject = Object.assign({}, this.state.finalData, response);
      this.props.setForm(finalObject);

      this.setState({
        finalData: finalObject,
        redirect: true
      });
    });
  };

  next = () => {
    const current = this.state.current + 1;
    this.setState({ current });
    window.scrollTo(0, 0);
  };

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
    window.scrollTo(0, 0);
  };

  render() {
    const { current, data, timezone, speciality, userRole } = this.state;
    const { form } = this.props;

    const steps = [
      {
        title: "Personal Information",
        content: (
          <Step1
            data={data[0]}
            timezone={timezone}
            form={form}
            speciality={speciality}
            userRole={userRole}
            onRoleChange={e => this.stepperQuestion(e)}
            formFields={
              this.props.formField && this.props.formField[1]
                ? this.props.formField[1]
                : []
            }
          />
        )
      },
      {
        title: "Professional Information",
        content: (
          <Step2
            data={data[1]}
            form={form}
            formFields={
              this.props.formField && this.props.formField[2]
                ? this.props.formField[2]
                : []
            }
          />
        )
      },
      {
        title: "Patient Care Information",
        content: (
          <Step3
            data={data[2]}
            form={form}
            formFields={
              this.props.formField && this.props.formField[3]
                ? this.props.formField[3]
                : []
            }
          />
        )
      },
      {
        title: "Additional Information",
        content: (
          <Step4
            data={data[3]}
            form={form}
            formFields={
              this.props.formField && this.props.formField[4]
                ? this.props.formField[4]
                : []
            }
          />
        )
      }
    ];

    return (
      <div style={{ marginBottom: "10em" }}>
        <Steps className="stepsclass" progressDot current={current}>
          {steps.map(i => (
            <Step key={i.title} title={i.title} className="text_app_color" />
          ))}
        </Steps>
        <div className="steps-content ">
          <Form hideRequiredMark colon={false}>
            {steps[current].content}
          </Form>
        </div>
        <div style={{ margin: "10px 0", width: "100%" }}>
          {current > 0 && (
            <Button
              type="link"
              onClick={this.previousStep}
              style={{ float: "left", width: "140px" }}
              className="link_button custom_secondary_btn"
            >
              BACK
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              type="primary"
              onClick={this.check}
              style={{ float: "right", width: "140px" }}
              className="link_button"
            >
              NEXT
            </Button>
          )}
          {current === steps.length - 1 && (
            <div>
              <Button
                type="primary"
                onClick={e => this.done(e, this.props)}
                style={{ float: "right", width: "140px" }}
                className="link_button"
              >
                REGISTER
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    formField: state.formField
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setForm: formField => dispatch(setForm(formField)),
    resetForm: formField => dispatch(resetForm(formField))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(Stepper));
