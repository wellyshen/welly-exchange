import axios from "axios";

import {
  Base,
  ThunkAction,
  ThunkDispatch,
  ThunkState,
  EUR_RATE_REQUESTING,
  EUR_RATE_SUCCESS,
  EUR_RATE_FAILURE,
  GBP_RATE_REQUESTING,
  GBP_RATE_SUCCESS,
  GBP_RATE_FAILURE,
  USD_RATE_REQUESTING,
  USD_RATE_SUCCESS,
  USD_RATE_FAILURE
} from "../types";

const BASE_URL = "https://api.exchangeratesapi.io/latest?";
const symbols = {
  EUR: {
    requestType: EUR_RATE_REQUESTING,
    successType: EUR_RATE_SUCCESS,
    failureType: EUR_RATE_FAILURE,
    queries: "symbols=GBP,USD"
  },
  GBP: {
    requestType: GBP_RATE_REQUESTING,
    successType: GBP_RATE_SUCCESS,
    failureType: GBP_RATE_FAILURE,
    queries: "base=GBP&symbols=EUR,USD"
  },
  USD: {
    requestType: USD_RATE_REQUESTING,
    successType: USD_RATE_SUCCESS,
    failureType: USD_RATE_FAILURE,
    queries: "base=USD&symbols=EUR,GBP"
  }
};

export default (base: Base): ThunkAction => async (
  dispatch: ThunkDispatch,
  getState: ThunkState
) => {
  const { requestType, successType, failureType, queries } = (symbols as any)[
    base
  ];
  const targetState = (getState() as any)[`${base.toLowerCase()}Rate`];

  // Update data without changing the readyStatus of data
  if (targetState.readyStatus !== "success") dispatch({ type: requestType });

  try {
    const { data } = await axios.get(BASE_URL + queries);

    dispatch({ type: successType, data });
  } catch (error) {
    // Update data without changing the readyStatus of data
    targetState.readyStatus !== "success"
      ? dispatch({ type: failureType, error: error.message })
      : console.error("> fetchRate action: ", error);
  }
};
