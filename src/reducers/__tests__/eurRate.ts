import {
  EUR_RATE_REQUESTING,
  EUR_RATE_SUCCESS,
  EUR_RATE_FAILURE
} from "../../types";
import { eurRateData, error } from "../../utils/test";
import eurRate, { initialState } from "../eurRate";

describe("eurRate reducer", () => {
  it("should handle initial state correctly", () => {
    // @ts-ignore
    expect(eurRate(undefined, {})).toEqual(initialState);
  });

  it("should handle EUR_RATE_REQUESTING correctly", () => {
    expect(eurRate(undefined, { type: EUR_RATE_REQUESTING }))
      .toEqual({ ...initialState, readyStatus: "request", error: null });
  });

  it("should handle EUR_RATE_SUCCESS correctly", () => {
    expect(eurRate(undefined, { type: EUR_RATE_SUCCESS, data: eurRateData }))
      .toEqual({ ...initialState, readyStatus: "success", data: eurRateData });
  });

  it("should handle EUR_RATE_FAILURE correctly", () => {
    expect(eurRate(undefined, { type: EUR_RATE_FAILURE, error }))
      .toEqual({ ...initialState, readyStatus: "failure", error });
  });
});
