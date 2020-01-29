import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { testHelper, gbpRateData } from "../../../utils/test";
import fetchRate from "../../../actions/fetchRate";
import Rates from "..";

describe("<Rates />", () => {
  const defaultData = {
    readyStatus: "success",
    data: gbpRateData
  };
  const renderHelper = (data: object = defaultData) => {
    const { ProviderWithStore, dispatch } = testHelper({ gbpRate: data });
    const { container, ...others } = render(
      <ProviderWithStore>
        <Rates base="GBP" exchangeTo="EUR" />
      </ProviderWithStore>
    );

    return {
      ...others,
      container: container.firstChild,
      dispatch
    };
  };

  it("should render request status correctly", () => {
    const { container } = renderHelper({ readyStatus: "request" });
    expect(container).toMatchSnapshot();
  });

  it("should render success status correctly", () => {
    const { container } = renderHelper();
    expect(container).toMatchSnapshot();
  });

  it("should render failure status correctly", () => {
    const { container } = renderHelper({ readyStatus: "failure" });
    expect(container).toMatchSnapshot();
  });

  it("should disable retry when API success", () => {
    const { getByTestId, dispatch } = renderHelper();
    fireEvent.click(getByTestId("rates"));
    expect(dispatch).not.toBeCalled();
  });

  it("should enable retry when API failure", () => {
    const { getByTestId, dispatch } = renderHelper({ readyStatus: "failure" });
    fireEvent.click(getByTestId("rates"));
    // @ts-ignore
    expect(dispatch.mock.calls[0][0].toString()).toBe(
      fetchRate("GBP").toString()
    );
  });
});
