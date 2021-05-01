import React, { Component } from "react";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import ForgotPassword from "../pages/ForgotPassword";
import Register from "../pages/Register";
import PendingStudies from "../pages/PendingStudies";
import PastStudies from "../pages/PastStudies";
import CurrentStudies from "../pages/CurrentStudies";
import PendingStudyDetail from "../pages/PendingStudyDetail";
import Payments from "../pages/Payments";
import MyAccount from "../pages/MyAccount";
import EditAccount from "../pages/EditAccount";
import Page404 from "../pages/Page404";
import Schedule from "../pages/Schedule";
import Notifications from "../pages/Notifications";
import Support from "../pages/Support";
import Privacy from "../pages/Privacy";
import HelpCenter from "../pages/HelpCenter";
import ContactUs from "../pages/ContactUs";
import TermsOfService from "../pages/TermsOfService";
import CoverPage from "../pages/CoverPage";

class ProtectedRoute extends Component {
  render() {
    const { component: Component, authed, ...props } = this.props;

    return (
      <Route
        {...props}
        render={props =>
          authed ? <Component {...props} /> : <Redirect to="/" />
        }
      />
    );
  }
}

class PrivateRoute extends Component {
  PrivateRoute = ({ component: Component, authed, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props =>
          authed === true ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          )
        }
      />
    );
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={CoverPage} />
          <ProtectedRoute
            authed={this.props.token}
            exact
            path="/home"
            component={Home}
          />
          <Route
            path="/sign_in"
            component={SignIn}
          />
          <Route path="/register" component={Register} />
          <Route path="/forgot-password" component={ForgotPassword} />
          
          <ProtectedRoute
            authed={this.props.token}
            path="/pending-studies"
            component={PendingStudies}
          />
          <ProtectedRoute
            authed={this.props.token}
            path="/past-studies"
            component={PastStudies}
          />
          <ProtectedRoute
            authed={this.props.token}
            path="/current-studies"
            component={CurrentStudies}
          />
          <ProtectedRoute
            authed={this.props.token}
            path="/study/:uuid/detail"
            component={PendingStudyDetail}
          />
          <ProtectedRoute
            authed={this.props.token}
            path="/Payments"
            component={Payments}
          />
          <ProtectedRoute
            authed={this.props.token}
            path="/my-account"
            component={MyAccount}
          />
          <ProtectedRoute
            authed={this.props.token}
            path="/edit-account"
            component={EditAccount}
          />
        
          <ProtectedRoute
            authed={this.props.token}
            path="/my-schedule"
            component={Schedule}
          />
          <ProtectedRoute
            authed={this.props.token}
            path="/notifications"
            component={Notifications}
          />
          <ProtectedRoute
            authed={this.props.token}
            exact
            path="/contact-us"
            component={ContactUs}
          />

          <Route path="/support" component={Support} />

          <Route path="/help-center" component={HelpCenter} />

          <Route path="/terms-of-service" component={TermsOfService} />

          <Route path="/privacy" component={Privacy} />

          <Route component={Page404} />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    token: state.token,
  };
};
export default connect(mapStateToProps)(PrivateRoute);
