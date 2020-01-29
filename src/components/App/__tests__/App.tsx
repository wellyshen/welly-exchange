import React from "react";
import { render, act, fireEvent, cleanup } from "@testing-library/react";

import {
  testHelper,
  gbpRateData,
  eurRateData,
  usdRateData
} from "../../../utils/test";
import formatDigits from "../../../utils/formatDigits";
import fetchRate from "../../../actions/fetchRate";
import App, { notEnoughMsg, errorMsg, doneMsg } from "..";

interface State {
  readyStatus: string;
  data?: object;
}
interface Config {
  eurRate?: State;
  gbpRate?: State;
  usdRate?: State;
}

describe("<App />", () => {
  jest.useFakeTimers();
  window.alert = jest.fn();

  const gbpPrefix = "You have £";
  const eurPrefix = "You have €";
  const usdPrefix = "You have $";
  const renderHelper = ({ gbpRate, eurRate, usdRate }: Config = {}) => {
    const { ProviderWithStore, dispatch } = testHelper({
      gbpRate: gbpRate || { readyStatus: "success", data: gbpRateData },
      eurRate: eurRate || { readyStatus: "success", data: eurRateData },
      usdRate: usdRate || { readyStatus: "success", data: usdRateData }
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

  it("should render correctly before changing pocket", () => {
    const { container } = renderHelper();
    expect(container).toMatchSnapshot();
  });

  it("should render correctly after changing pocket", () => {
    const { container, getAllByLabelText } = renderHelper();
    const bottomCenterDot = getAllByLabelText("slide 2 bullet")[1];
    fireEvent.click(bottomCenterDot);
    act(() => {
      // Immediately execute the "afterSlide" event of Carousel component
      jest.runOnlyPendingTimers();
    });
    expect(container).toMatchSnapshot();
  });

  it("should update data for every 10 seconds", () => {
    const { dispatch } = renderHelper();
    const times = 3;
    jest.advanceTimersByTime(times * 10 * 1000);
    // The extra 3 times are called when componentDidMount
    expect(dispatch).toBeCalledTimes(times * 3 + 3);
    // @ts-ignore
    expect(dispatch.mock.calls[0][0].toString()).toBe(
      fetchRate("EUR").toString()
    );
    // @ts-ignore
    expect(dispatch.mock.calls[0][0].toString()).toBe(
      fetchRate("GBP").toString()
    );
    // @ts-ignore
    expect(dispatch.mock.calls[0][0].toString()).toBe(
      fetchRate("USD").toString()
    );
  });

  it("should disable exchange when input value is empty", () => {
    const { getByTestId } = renderHelper();
    expect(getByTestId("exchange")).toHaveAttribute("disabled");
  });

  it("should disable exchange when pockets are the same", () => {
    const { getByTestId, getAllByTestId, getAllByLabelText } = renderHelper();
    fireEvent.change(getAllByTestId("input")[0], { target: { value: "1" } });
    expect(getByTestId("exchange")).not.toHaveAttribute("disabled");

    // Align GBP to GBP
    const bottomCenterDot = getAllByLabelText("slide 2 bullet")[1];
    fireEvent.click(bottomCenterDot);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(getByTestId("exchange")).toHaveAttribute("disabled");
  });

  it('should show a popup with error message if the "depositRate" is unavailable', () => {
    const { getByTestId, getAllByTestId } = renderHelper({
      gbpRate: { readyStatus: "failure" }
    });
    fireEvent.change(getAllByTestId("input")[0], { target: { value: "50" } });
    fireEvent.click(getByTestId("exchange"));
    expect(window.alert).toBeCalledWith(errorMsg);
  });

  it("should show a popup with not enough message if exchange > deposit", () => {
    const { getByTestId, getAllByTestId } = renderHelper();
    fireEvent.change(getAllByTestId("input")[0], { target: { value: "200" } });
    fireEvent.click(getByTestId("exchange"));
    expect(window.alert).toBeCalledWith(notEnoughMsg);
  });

  it("should show a popup with done message if exchange <= deposit", () => {
    const { getByTestId, getAllByTestId } = renderHelper();
    fireEvent.change(getAllByTestId("input")[0], { target: { value: "50" } });
    fireEvent.click(getByTestId("exchange"));
    expect(window.alert).toBeCalledWith(doneMsg);
    // Make sure all the input values are reset
    getAllByTestId("input").forEach(input => {
      expect(input.textContent).toBe("");
    });
  });

  it("should exchange currency from the (up) out-pocket correctly", () => {
    const { getByTestId, getAllByTestId, getAllByLabelText } = renderHelper();
    expect(getAllByTestId("deposit")[0].textContent).toBe(gbpPrefix + "100.66"); // GBP
    expect(getAllByTestId("deposit")[3].textContent).toBe(eurPrefix + "120.66"); // EUR
    expect(getAllByTestId("deposit")[5].textContent).toBe(usdPrefix + "110.66"); // USD

    let depositRate = gbpRateData.rates["EUR"];
    let deposit = formatDigits(120.66 + depositRate);
    fireEvent.change(getAllByTestId("input")[0], { target: { value: "1" } });
    fireEvent.click(getByTestId("exchange"));
    expect(getAllByTestId("deposit")[0].textContent).toBe(gbpPrefix + "99.66");
    expect(getAllByTestId("deposit")[3].textContent).toBe(eurPrefix + deposit);

    // Make sure exchange to USD correctly
    depositRate = gbpRateData.rates["USD"];
    deposit = formatDigits(110.66 + depositRate);
    fireEvent.change(getAllByTestId("input")[0], { target: { value: "1" } });
    // Align GBP to USD
    const bottomRightDot = getAllByLabelText("slide 3 bullet")[1];
    fireEvent.click(bottomRightDot);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    fireEvent.click(getByTestId("exchange"));
    expect(getAllByTestId("deposit")[0].textContent).toBe(gbpPrefix + "98.66");
    expect(getAllByTestId("deposit")[5].textContent).toBe(usdPrefix + deposit);
  });

  it("should exchange currency from the (bottom) in-pocket correctly", () => {
    const { getByTestId, getAllByTestId, getAllByLabelText } = renderHelper();
    expect(getAllByTestId("deposit")[0].textContent).toBe(gbpPrefix + "100.66"); // GBP
    expect(getAllByTestId("deposit")[1].textContent).toBe(usdPrefix + "110.66"); // USD
    expect(getAllByTestId("deposit")[3].textContent).toBe(eurPrefix + "120.66"); // EUR

    let depositRate = eurRateData.rates["GBP"];
    let deposit = formatDigits(100.66 - depositRate);
    fireEvent.change(getAllByTestId("input")[3], { target: { value: "1" } });
    fireEvent.click(getByTestId("exchange"));
    expect(getAllByTestId("deposit")[0].textContent).toBe(gbpPrefix + deposit);
    expect(getAllByTestId("deposit")[3].textContent).toBe(eurPrefix + "121.66");

    // Make sure exchange to USD correctly
    depositRate = eurRateData.rates["USD"];
    deposit = formatDigits(110.66 - depositRate);
    fireEvent.change(getAllByTestId("input")[3], { target: { value: "1" } });
    // Align EUR to USD
    const topCenterDot = getAllByLabelText("slide 2 bullet")[0];
    fireEvent.click(topCenterDot);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    fireEvent.click(getByTestId("exchange"));
    expect(getAllByTestId("deposit")[1].textContent).toBe(usdPrefix + deposit);
    expect(getAllByTestId("deposit")[3].textContent).toBe(eurPrefix + "122.66");
  });
});
