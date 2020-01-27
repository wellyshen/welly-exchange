import React from "react";
import { render, fireEvent } from "@testing-library/react";

import {
  testHelper,
  gbpRateData,
  eurRateData,
  usdRateData
} from "../../../utils/test";
import fetchRate from "../../../actions/fetchRate";
import App, { errorMsg, doneMsg } from "..";

describe("<App />", () => {
  window.alert = jest.fn();

  const renderHelper = () => {
    const { ProviderWithStore, dispatch } = testHelper({
      gbpRate: { readyStatus: "success", data: gbpRateData },
      eurRate: { readyStatus: "success", data: eurRateData },
      usdRate: { readyStatus: "success", data: usdRateData }
    });
    const { container, ...others } = render(
      <ProviderWithStore>
        <App />
      </ProviderWithStore>
    );

    return {
      ...others,
      test: container,
      container: container.firstChild,
      dispatch
    };
  };

  it("should render correctly", () => {
    const { container } = renderHelper();
    expect(container).toMatchSnapshot();
  });

  it("should update data for every 10 seconds", () => {
    jest.useFakeTimers();
    const { dispatch } = renderHelper();
    const times = 3;
    jest.advanceTimersByTime(times * 10 * 1000);
    // The extra 3 times are called when component did mount
    expect(dispatch).toBeCalledTimes(times * 3 + 3);
    // @ts-ignore
    expect(dispatch.mock.calls[0][0].toString()).toBe(fetchRate("EUR").toString());
    // @ts-ignore
    expect(dispatch.mock.calls[0][0].toString()).toBe(fetchRate("GBP").toString());
    // @ts-ignore
    expect(dispatch.mock.calls[0][0].toString()).toBe(fetchRate("USD").toString());
  });

  it("should disable exchange when input value is empty", () => {
    const { getByTestId } = renderHelper();
    expect(getByTestId("exchange")).toHaveAttribute("disabled");
  });

  it("should show a popup with error message if exchange > deposit", () => {
    const { getByTestId, getAllByTestId } = renderHelper();
    fireEvent.change(getAllByTestId("input")[0], { target: { value: "168" } });
    fireEvent.click(getByTestId("exchange"));
    expect(window.alert).toBeCalledWith(errorMsg);
  });

  it("should show a popup with done message if exchange <= deposit", () => {
    const { getByTestId, getAllByTestId } = renderHelper();
    fireEvent.change(getAllByTestId("input")[0], { target: { value: "50" } });
    fireEvent.click(getByTestId("exchange"));
    expect(window.alert).toBeCalledWith(doneMsg);
  });
});
