import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';

import storage from 'redux-persist/lib/storage';
import reducer from './reducer';

const middleWare = [];

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store, null, compose(applyMiddleware(...middleWare)));

export default {store,persistor};
