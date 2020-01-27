import axios from "axios";

import {
  GBP_RATE_REQUESTING,
  GBP_RATE_SUCCESS,
  GBP_RATE_FAILURE
} from "../../types";
import { initialState } from "../../reducers/gbpRate";
import { testHelper, gbpRateData, error } from "../../utils/test";
import fetchRate from "../fetchRate";

jest.mock("axios");

describe("fetchRate action", () => {
  it("creates *_RATE_REQUESTING and *_RATE_SUCCESS when fetching data has been done", async () => {
    const { dispatch, getActions } = testHelper({ gbpRate: initialState });
    const expectedActions = [
      { type: GBP_RATE_REQUESTING },
      { type: GBP_RATE_SUCCESS, data: gbpRateData }
    ];

    // @ts-ignore
    axios.get.mockResolvedValue({ data: gbpRateData });

    // @ts-ignore
    await dispatch(fetchRate("GBP"));
    expect(getActions()).toEqual(expectedActions);
  });

  it("creates *_RATE_SUCCESS only when data has already been fetched", async () => {
    const { dispatch, getActions } = testHelper({
      gbpRate: { ...initialState, readyStatus: "success" }
    });
    const expectedActions = [{ type: GBP_RATE_SUCCESS, data: gbpRateData }];

    // @ts-ignore
    axios.get.mockResolvedValue({ data: gbpRateData });

    // @ts-ignore
    await dispatch(fetchRate("GBP"));
    expect(getActions()).toEqual(expectedActions);
  });

  it("creates nothing when data has already been fetched and fail to update", async () => {
    global.console.error = jest.fn();
    const { dispatch, getActions } = testHelper({
      gbpRate: { ...initialState, readyStatus: "success" }
    });

    // @ts-ignore
    axios.get.mockRejectedValue(error);

    // @ts-ignore
    await dispatch(fetchRate("GBP"));
    expect(getActions()).toEqual([]);
    expect(console.error).toBeCalledWith("> fetchRate action: ", error);
  });

  it("creates *_RATE_REQUESTING and *_RATE_FAILURE when fail to fetch data", async () => {
    const { dispatch, getActions } = testHelper({ gbpRate: initialState });
    const expectedActions = [
      { type: GBP_RATE_REQUESTING },
      { type: GBP_RATE_FAILURE, error }
    ];

    // @ts-ignore
    axios.get.mockRejectedValue(error);

    // @ts-ignore
    await dispatch(fetchRate("GBP"));
    expect(getActions()).toEqual(expectedActions);
  });
});
