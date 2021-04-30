import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
  
import Farm from "../pages/farm";
  
class Routes extends Component {

  
    render() {
      return (
        <Router>
          <Switch>
            <Route exact path="/" component={Farm} />
           </Switch>
        </Router>
      );
    }
}

export default Routes;
