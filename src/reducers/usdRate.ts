import {
  RateState,
  RateAction,
  USD_RATE_REQUESTING,
  USD_RATE_SUCCESS,
  USD_RATE_FAILURE
} from "../types";

// Export for unit testing
export const initialState: RateState = {
  readyStatus: "invalid",
  data: {},
  error: null
};

export default (state = initialState, action: RateAction) => {
  switch (action.type) {
    case USD_RATE_REQUESTING:
      return {
        ...state,
        readyStatus: "request",
        error: null
      };
    case USD_RATE_SUCCESS:
      return {
        ...state,
        readyStatus: "success",
        data: action.data
      };
    case USD_RATE_FAILURE:
      return {
        ...state,
        readyStatus: "failure",
        error: action.error
      };
    default:
      return state;
  }
};
