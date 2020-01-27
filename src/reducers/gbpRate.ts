import {
  RateState,
  RateAction,
  GBP_RATE_REQUESTING,
  GBP_RATE_SUCCESS,
  GBP_RATE_FAILURE
} from "../types";

// Export for unit testing
export const initialState: RateState = {
  readyStatus: "invalid",
  data: {},
  error: null
};

export default (state = initialState, action: RateAction) => {
  switch (action.type) {
    case GBP_RATE_REQUESTING:
      return {
        ...state,
        readyStatus: "request"
      };
    case GBP_RATE_SUCCESS:
      return {
        ...state,
        readyStatus: "success",
        data: action.data
      };
    case GBP_RATE_FAILURE:
      return {
        ...state,
        readyStatus: "failure",
        error: action.error
      };
    default:
      return state;
  }
};
