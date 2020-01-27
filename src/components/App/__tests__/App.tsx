import React from "react";
import { render, fireEvent } from "@testing-library/react";

import {
  testHelper,
  gbpRateData,
  eurRateData,
  usdRateData
} from "../../../utils/test";
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
      container: container.firstChild,
      dispatch
    };
  };

  it("should render correctly", () => {
    const { container } = renderHelper();
    expect(container).toMatchSnapshot();
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
