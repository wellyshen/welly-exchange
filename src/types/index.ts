import { Action } from "redux";
import { ThunkAction as Act, ThunkDispatch as Dispatch } from "redux-thunk";

/** App */
export type Base = "GBP" | "EUR" | "USD";

/** Reducer */
export interface RateState {
  readyStatus: string;
  data: object;
  error: any;
}

interface AppState {
  eurRate: RateState;
  gbpRate: RateState;
  usdRate: RateState;
}

export type ThunkState = () => AppState;

/** Action */
export const EUR_RATE_REQUESTING = "EUR_RATE_REQUESTING";
export const EUR_RATE_SUCCESS = "EUR_RATE_SUCCESS";
export const EUR_RATE_FAILURE = "EUR_RATE_FAILURE";

export const GBP_RATE_REQUESTING = "GBP_RATE_REQUESTING";
export const GBP_RATE_SUCCESS = "GBP_RATE_SUCCESS";
export const GBP_RATE_FAILURE = "GBP_RATE_FAILURE";

export const USD_RATE_REQUESTING = "USD_RATE_REQUESTING";
export const USD_RATE_SUCCESS = "USD_RATE_SUCCESS";
export const USD_RATE_FAILURE = "USD_RATE_FAILURE";

export interface RateAction {
  type:
    | typeof EUR_RATE_REQUESTING
    | typeof EUR_RATE_SUCCESS
    | typeof EUR_RATE_FAILURE
    | typeof GBP_RATE_REQUESTING
    | typeof GBP_RATE_SUCCESS
    | typeof GBP_RATE_FAILURE
    | typeof USD_RATE_REQUESTING
    | typeof USD_RATE_SUCCESS
    | typeof USD_RATE_FAILURE;
  data?: object;
  error?: any;
}

export type ThunkAction = Act<void, AppState, null, Action<string>>;

export type ThunkDispatch = Dispatch<AppState, void, RateAction>;
