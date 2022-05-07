import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { reducer as network, createNetworkMiddleware } from "react-native-offline";
import createSagaMiddleware from "redux-saga";
import { surveyReducer } from './reducers';
import { watcherSaga } from "../sagas";

const sagaMiddleware = createSagaMiddleware();
const networkMiddleware = createNetworkMiddleware();

const PERSIST_CONFIG = { key: "root", storage, blacklist: ["network", "survey"] };
const SURVEY_PERSIST_CONFIG = { key: "survey", storage, blacklist: ["isNetworkBannerVisible"] };

const rootReducer = combineReducers({
  survey: persistReducer(SURVEY_PERSIST_CONFIG, surveyReducer),
  network
});

const persistedReducer = persistReducer(PERSIST_CONFIG, rootReducer);

export const store = createStore(
  persistedReducer,
  applyMiddleware(networkMiddleware, sagaMiddleware)
);

export const persistor = persistStore(store);

sagaMiddleware.run(watcherSaga);
