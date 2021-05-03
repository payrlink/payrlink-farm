import axios from "axios";
import AppStore from "../redux/store";

// import {logout} from '../redux/auth/action';
// import {EventEmitter} from 'fbemitter';

let axiosInstance = axios.create({
  // baseURL: "http://192.168.1.75:8000/api/v1/",
  // baseURL: "http://0.0.0.0:8000/api/v1/",
  baseURL: "https://rsapi.webmobtech.biz/api/v1/",
  // baseURL: "https://admin.blueprinthcp.com/api/v1/",
  timeout: 20000,
});
// const logoutEmitter = new EventEmitter();

AppStore.store.subscribe(listener);

function listener() {
  if (AppStore.store.getState() !== undefined) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${
      AppStore.store.getState().token
    }`;
  }
}

//axiosInstance.defaults.headers.common['Authorization'] = `Bearer highi`;
axiosInstance.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    let dataResponse = {
      status: response.status,
      meta: response.data.meta,
      data: response.data.data !== undefined ? response.data.data : null,
    };
    return Promise.resolve(dataResponse);
  },
  (error) => {
    let errorResponse = {
      status: error.response !== undefined ? error.response.status : 500,
      meta:
        error.response.data.meta !== undefined
          ? error.response.data.meta
          : undefined,
      data:
        error.response.data.data !== undefined
          ? error.response.data.data
          : undefined,
    };

    switch (errorResponse.status) {
      case 404:
        break;
      case 500:
        break;
      case 503:
        // store.dispatch(logout());
        // logoutEmitter.emit('logout');
        break;
      case 400:
        // store.dispatch(logout());
        // logoutEmitter.emit('logout');
        break;
      default:
        break;
    }
    return Promise.reject(errorResponse);
  }
);

export {
  axiosInstance,
  // logoutEmitter
};
