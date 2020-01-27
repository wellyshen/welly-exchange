import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import rootReducer from "../reducers";

export default () => {
  const isDev = process.env.NODE_ENV !== "production";
  const composeEnhancers =
    // @ts-ignore
    (isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};
