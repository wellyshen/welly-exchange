import {
  USD_RATE_REQUESTING,
  USD_RATE_SUCCESS,
  USD_RATE_FAILURE
} from "../../types";
import { usdRateData, error } from "../../utils/test";
import usdRate, { initialState } from "../usdRate";

describe("usdRate reducer", () => {
  it("should handle initial state correctly", () => {
    // @ts-ignore
    expect(usdRate(undefined, {})).toEqual(initialState);
  });

  it("should handle USD_RATE_REQUESTING correctly", () => {
    expect(usdRate(undefined, { type: USD_RATE_REQUESTING }))
      .toEqual({ ...initialState, readyStatus: "request", error: null });
  });

  it("should handle USD_RATE_SUCCESS correctly", () => {
    expect(usdRate(undefined, { type: USD_RATE_SUCCESS, data: usdRateData }))
      .toEqual({ ...initialState, readyStatus: "success", data: usdRateData });
  });

  it("should handle USD_RATE_FAILURE correctly", () => {
    expect(usdRate(undefined, { type: USD_RATE_FAILURE, error }))
      .toEqual({ ...initialState, readyStatus: "failure", error });
  });
});
