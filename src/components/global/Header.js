import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Row,
  Col,
  Checkbox,
  Drawer,
  Button,
  Icon,
  Input,
  notification,
  Modal,
  Form
} from "antd";
import Logo from "../../assets/images/BPRG_WhiteLogo.svg";
import "../../scss/header.scss";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { logout, setUser } from "../../redux/action";
import {
  APIRequest,
  API_NOTIFICATIONS_PREF,
  API_CHANGE_PASSWORD
} from "../../api";

const { SubMenu } = Menu;

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUser(user)),
    logout: () => dispatch(logout())
  };
};

const mapStateToProps = state => {
  if (state === undefined) return {};

  return {
    user: state.user
  };
};

class Header extends Component {
  static propTypes = {
    // match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
    // history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isDesktop: false,
      mobile: this.props.user.notification_sms,
      email: this.props.user.notification_email
    };
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  notificationStore() {
    new APIRequest.Builder()
      .post()
      .setReqId(API_NOTIFICATIONS_PREF)
      .jsonParams({
        notification_email: this.state.email,
        notification_sms: this.state.mobile
      })
      .reqURL("/notification-status")
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
  }

  onResponse = (response, reqId) => {
    // this._hideLoader();
    switch (reqId) {
      case API_NOTIFICATIONS_PREF:
        this.props.setUser(response.data.user);
        break;

      case API_CHANGE_PASSWORD:
        this.setState({
          visibleChangePass: false
        });
        notification.success({
          message: response.meta.message
        });
        break;

      default:
        break;
    }
  };

  onError = (response, reqId) => {
    switch (reqId) {
      case API_NOTIFICATIONS_PREF:
        console.log("erorr", response);

        break;
      case API_CHANGE_PASSWORD:
        notification.error({
          message: response.meta.message
        });
        break;
      default:
        break;
    }
  };

  showModal = () => {
    this.setState({
      visibleChangePass: true
    });
  };

  handleOk = e => {
    this.setState({
      visibleChangePass: false
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.changePassword();
      }
    });
  };

  handleCancel = e => {
    this.setState({
      visibleChangePass: false
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("new")) {
      callback("The password and confirm password must match.");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  changePassword = () => {
    new APIRequest.Builder()
      .post()
      .setReqId(API_CHANGE_PASSWORD)
      .reqURL("/change-password")
      .jsonParams({
        old_password: this.state.oldPass,
        password: this.state.newPass,
        confirm_password: this.state.confPass
      })
      .response(this.onResponse)
      .error(this.onError)
      .build()
      .doRequest();
  };

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePredicate);
  }

  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 991.98 });
  }

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };
  render() {
    const checkboxStyle = {
      display: "flex",
      height: "30px",
      marginLeft: 0,
      padding: "0.5em 1.5em",
      alignItems: "center"
    };
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const isDesktop = this.state.isDesktop;
    return (
      <div>
        {isDesktop ? (
          <Row type="flex" align="middle" className="header_menu bg_app_color">
            <Col sm={24} lg={4} xl={4}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={Logo}
                  style={{
                    height: "40px"
                  }}
                  alt="logo"
                />
              </div>
            </Col>
            <Col sm={24} lg={16} xl={16}>
              <Menu
                onClick={this.handleClick}
                selectedKeys={[this.props.location.pathname]}
                mode="horizontal"
                style={{ border: 0, background: "none" }}
              >
                <Menu.Item key="/home">
                  <Link to="/home">Home</Link>
                </Menu.Item>
                <SubMenu
                  title={<span className="submenu-title-wrapper">Studies</span>}
                >
                  <Menu.Item key="/pending-studies">
                    <Link to="/pending-studies">Pending Studies</Link>
                  </Menu.Item>
                  <Menu.Item key="/current-studies">
                    <Link to="/current-studies">Current Studies</Link>
                  </Menu.Item>
                  <Menu.Item key="/past-studies">
                    <Link to="/past-studies">Past Studies</Link>
                  </Menu.Item>
                </SubMenu>
                <Menu.Item key="/payments">
                  <Link to="/payments">Payments</Link>
                </Menu.Item>
                <Menu.Item key="/my-schedule">
                  <Link to="/my-schedule">My Schedule</Link>
                </Menu.Item>
                <Menu.Item key="/my-account">
                  <Link to="/my-account">My Account</Link>
                </Menu.Item>
                <Menu.Item key="/contact-us">
                  <Link to="/contact-us">Contact Us</Link>
                </Menu.Item>
              </Menu>
            </Col>
            <Col sm={22} lg={4} xl={4}>
              <Menu
                onClick={this.handleClick}
                selectedKeys={[this.props.location.pathname]}
                mode="horizontal"
                style={{ border: 0, background: "none" }}
              >
                <SubMenu
                  className="menu_without_border"
                  title={
                    <span className="submenu-title-wrapper">
                      <i
                        className="icon-setting"
                        style={{ fontSize: "16px", padding: "0" }}
                      />
                    </span>
                  }
                >
                  <Menu.Item key="change-password" onClick={this.showModal}>
                    Change Password
                  </Menu.Item>

                  <SubMenu
                    key="notification-pre"
                    style={{ padding: "0", minWidth: "205px" }}
                    title="Notification Preference"
                  >
                    {/* <Checkbox.Group
                      style={{ width: "100%", padding: "10px" }}
                      onChange={this.onChange}
                      defaultValue={[1]}
                    > */}
                    <div style={{ padding: "0.5em 0" }}>
                      <Checkbox
                        value={1}
                        style={checkboxStyle}
                        checked={this.state.mobile}
                        onChange={e => {
                          this.setState(
                            {
                              mobile: e.target.checked === true ? 1 : 0
                            },
                            () => {
                              this.notificationStore();
                            }
                          );
                        }}
                      >
                        Mobile
                      </Checkbox>
                      <Checkbox
                        value={2}
                        style={checkboxStyle}
                        checked={this.state.email}
                        onChange={e => {
                          this.setState(
                            {
                              email: e.target.checked === true ? 1 : 0
                            },
                            () => {
                              this.notificationStore();
                            }
                          );
                        }}
                      >
                        Email
                      </Checkbox>
                    </div>
                    {/* </Checkbox.Group> */}
                  </SubMenu>
                </SubMenu>

                <Menu.Item
                  key="/notifications"
                  className="menu_without_border"
                  style={{ padding: "0.7em 0" }}
                >
                  <Link to="/notifications">
                    <i className="icon-bell" style={{ fontSize: "16px" }} />
                  </Link>
                </Menu.Item>
                <Menu.Item key="contact" className="menu_without_border">
                  <Button
                    type="link"
                    className="text_white"
                    onClick={() => {
                      this.props.logout(this.props);
                      this.props.history.push("/");
                    }}
                  >
                    Logout
                  </Button>
                </Menu.Item>
              </Menu>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col span={24} className="bg_app_color">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ padding: "1em" }}>
                  <img
                    src={Logo}
                    style={{
                      height: "40px"
                    }}
                    alt="logo"
                  />
                </div>
                <Button
                  type="link"
                  onClick={this.showDrawer}
                  style={{ float: "right" }}
                >
                  <Icon type="menu" className="text_white" />
                </Button>
              </div>

              <Drawer
                placement="left"
                closable={false}
                onClose={this.onClose}
                visible={this.state.visible}
                bodyStyle={{ padding: 0 }}
              >
                <Menu
                  onClick={this.handleClick}
                  style={{ width: "auto" }}
                  selectedKeys={[this.props.location.pathname]}
                  mode="inline"
                >
                  <Menu.Item key="/home">
                    <Link to="/home">Home</Link>
                  </Menu.Item>
                  <SubMenu
                    title={
                      <span className="submenu-title-wrapper">Studies</span>
                    }
                  >
                    <Menu.Item key="/pending-studies">
                      <Link to="/pending-studies">Pending Studies</Link>
                    </Menu.Item>
                    <Menu.Item key="/current-studies">
                      <Link to="/current-studies">Current Studies</Link>
                    </Menu.Item>
                    <Menu.Item key="/past-studies">
                      <Link to="/past-studies">Past Studies</Link>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Item key="/payments">
                    <Link to="/payments">Payments</Link>
                  </Menu.Item>
                  <Menu.Item key="schedule">
                    <Link to="/my-schedule">My Schedule</Link>
                  </Menu.Item>
                  <Menu.Item key="/my-account">
                    <Link to="/my-account">My Account</Link>
                  </Menu.Item>
                  <Menu.Item key="/contact-us">
                    <Link to="/contact-us">Contact Us</Link>
                  </Menu.Item>

                  <SubMenu
                    className="menu_without_border"
                    title={
                      <span className="submenu-title-wrapper">Setting</span>
                    }
                  >
                    <Menu.Item key="/change-password" onClick={this.showModal}>
                      Change Password
                    </Menu.Item>

                    <SubMenu
                      key="notification-pre"
                      style={{ padding: "0" }}
                      title="Notification Preference"
                    >
                      {/* <Checkbox.Group
                        style={{ width: "100%", padding: "10px" }}
                        onChange={e => {
                          this.setState({
                            mobile: e.target.checked
                          });
                        }}
                      > */}
                      <div style={{ padding: "0.5em 3em" }}>
                        <Checkbox
                          value={1}
                          style={checkboxStyle}
                          checked={this.state.mobile}
                          onChange={e => {
                            this.setState(
                              {
                                mobile: e.target.checked === true ? 1 : 0
                              },
                              () => {
                                this.notificationStore();
                              }
                            );
                          }}
                        >
                          Mobile
                        </Checkbox>
                        <Checkbox
                          value={2}
                          style={checkboxStyle}
                          checked={this.state.email}
                          onChange={e => {
                            this.setState(
                              {
                                email: e.target.checked === true ? 1 : 0
                              },
                              () => {
                                this.notificationStore();
                              }
                            );
                          }}
                        >
                          Email
                        </Checkbox>
                      </div>
                      {/* </Checkbox.Group> */}
                    </SubMenu>
                  </SubMenu>
                  <Menu.Item
                    key="/notifications"
                    className="menu_without_border"
                    style={{ padding: "0" }}
                  >
                    <Link to="/notifications">Notifications</Link>
                  </Menu.Item>
                  <Menu.Item key="logout" className="menu_without_border">
                    <Button
                      onClick={() => {
                        this.props.logout(this.props);
                        this.props.history.push("/");
                      }}
                    >
                      Logout
                    </Button>
                  </Menu.Item>
                </Menu>
              </Drawer>
            </Col>
          </Row>
        )}

        <Modal
          title="Change password"
          centered
          maskStyle={{ backgroundColor: "rgba(0, 39, 102, 0.7)" }}
          visible={this.state.visibleChangePass}
          onCancel={this.handleCancel}
          okText="Update Password"
          className="change-password"
        >
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <Form.Item label="Current Password">
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: "This Field is Required!"
                  }
                ]
              })(
                <Input.Password
                  placeholder="Enter Current Password"
                  onChange={e => {
                    this.setState({
                      oldPass: e.target.value
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item label="New Password">
              {getFieldDecorator("new", {
                rules: [
                  {
                    required: true,
                    message: "This Field is Required!"
                  },
                  {
                    validator: this.validateToNextPassword
                  },
                  {
                    pattern: /^(?=.*\d)(?=.*[0-9])(?=.*[a-zA-Z]).{8,}/,
                    message:
                      "The password should be 8 characters atleast and should have atleast one number."
                  }
                ]
              })(
                <Input.Password
                  placeholder="Enter New Password"
                  onChange={e => {
                    this.setState({
                      newPass: e.target.value
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item label="Confirm Password:">
              {getFieldDecorator("confirm", {
                rules: [
                  {
                    required: true,
                    message: "This Field is Required!"
                  },
                  {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(
                <Input.Password
                  placeholder="Enter New Password Again"
                  onChange={e => {
                    this.setState({
                      confPass: e.target.value
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="submit"
                className="float-right"
                onClick={this.handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                htmlType="submit"
                className="float-right"
                style={{ marginRight: "15px" }}
              >
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

// export default withRouter(Header);
export default Form.create()(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Header))
);
