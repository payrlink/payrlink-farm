import {
    SET_TOKEN,
    SET_USER,
    SET_FORM

} from "./action-types";

import {REHYDRATE} from 'redux-persist/lib/constants';
let initialState = {
    user: null,
    token: null,
    formField:null
};

export const setToken = (token) => ({type: SET_TOKEN, token});
export const setUser = (user) => ({type: SET_USER, user});
export const setForm = (formField) => ({type: SET_FORM, formField});


export const logout = () => ({type: REHYDRATE, payload: initialState});
export const resetForm = () => ({type: REHYDRATE, payload: initialState});