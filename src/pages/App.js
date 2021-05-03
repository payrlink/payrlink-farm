import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppStore from "../redux/store";
import PrivateRoute from "../route/PrivateRoute";
import "../assets/css/fontello.css";
import "../scss/app.scss";

class App extends Component {
  render() {
    return (
      <div>
        <Helmet
          titleTemplate="%s - Blueprint HCP"
          defaultTitle="Blueprint HCP"
        >
          <meta name="description" content="A React.js aapplication" />
        </Helmet>
        <Provider store={AppStore.store}>
          <PersistGate loading={null} persistor={AppStore.persistor}>
            <div className="App">
              <Router>
                <PrivateRoute />
              </Router>
            </div>
          </PersistGate>
        </Provider>
      </div>
    );
  }
}
export default App;
// export default connect(mapStateToProps, mapDispatchToProps)(App);
