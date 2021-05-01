import { SET_USER, SET_TOKEN, SET_FORM } from "./action-types";
import { REHYDRATE } from "redux-persist/lib/constants";

let initial = {
  user: null,
  token: null,
  formField: null
};

const reducer = (state = initial, action) => {
  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, { user: action.user });
    case SET_TOKEN:
      return Object.assign({}, state, { token: action.token });
    case SET_FORM:
      return Object.assign({}, state, { formField: action.formField });
    case REHYDRATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
