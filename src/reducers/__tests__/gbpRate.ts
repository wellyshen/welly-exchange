import {
  GBP_RATE_REQUESTING,
  GBP_RATE_SUCCESS,
  GBP_RATE_FAILURE
} from "../../types";
import { gbpRateData, error } from "../../utils/test";
import gbpRate, { initialState } from "../gbpRate";

describe("gbpRate reducer", () => {
  it("should handle initial state correctly", () => {
    // @ts-ignore
    expect(gbpRate(undefined, {})).toEqual(initialState);
  });

  it("should handle GBP_RATE_REQUESTING correctly", () => {
    expect(gbpRate(undefined, { type: GBP_RATE_REQUESTING }))
      .toEqual({ ...initialState, readyStatus: "request", error: null });
  });

  it("should handle GBP_RATE_SUCCESS correctly", () => {
    expect(gbpRate(undefined, { type: GBP_RATE_SUCCESS, data: gbpRateData }))
      .toEqual({ ...initialState, readyStatus: "success", data: gbpRateData });
  });

  it("should handle GBP_RATE_FAILURE correctly", () => {
    expect(gbpRate(undefined, { type: GBP_RATE_FAILURE, error }))
      .toEqual({ ...initialState, readyStatus: "failure", error });
  });
});
