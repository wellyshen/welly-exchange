import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { testHelper, eurRateData, gbpRateData } from "../../../utils/test";
import fetchRate from "../../../actions/fetchRate";
import Pocket from "..";

interface State {
  readyStatus: string;
  data?: object;
}
interface Config {
  eurRate?: State;
  gbpRate?: State;
  props?: object;
}

describe("<Pocket />", () => {
  const renderHelper = ({ eurRate, gbpRate, props }: Config = {}) => {
    const { ProviderWithStore, dispatch } = testHelper({
      eurRate: eurRate || { readyStatus: "success", data: eurRateData },
      gbpRate: gbpRate || { readyStatus: "success", data: gbpRateData }
    });
    const pocketProps = {
      base: "EUR",
      deposit: 120.66,
      exchangeTo: "GBP",
      exchangeDisabled: false,
      isExchangeIn: true,
      inputVal: "1",
      onInputChange: () => {},
      ...props
    };
    const { container, ...others } = render(
      <ProviderWithStore>
        {/*
          // @ts-ignore */}
        <Pocket {...pocketProps} />
      </ProviderWithStore>
    );

    return {
      ...others,
      container: container.firstChild,
      dispatch
    };
  };

  it("should render request status correctly", () => {
    const data = { readyStatus: "request" };
    const { container } = renderHelper({ eurRate: data, gbpRate: data });
    expect(container).toMatchSnapshot();
  });

  it("should render success status correctly", () => {
    const { container } = renderHelper();
    expect(container).toMatchSnapshot();
  });

  it("should render failure status correctly", () => {
    const data = { readyStatus: "failure" };
    const { container } = renderHelper({ eurRate: data, gbpRate: data });
    expect(container).toMatchSnapshot();
  });

  it('should not render rate-info when the "isExchangeIn" set to false', () => {
    const { queryByTestId } = renderHelper({ props: { isExchangeIn: false } });
    expect(queryByTestId("rate-info")).toBeNull();
  });

  it('should render the prefix of input value correctly base on the "isExchangeIn"', () => {
    let getAllByTestId = renderHelper().getAllByTestId;
    // @ts-ignore
    expect(getAllByTestId("input")[0].value).toBe("+1.19");

    getAllByTestId = renderHelper({ props: { isExchangeIn: false } }).getAllByTestId;
    // @ts-ignore
    expect(getAllByTestId("input")[1].value).toBe("-1.19");
  });

  it('should not do exchange when the "exchangeDisabled" set to true', () => {
    let getAllByTestId = renderHelper().getAllByTestId;
    // @ts-ignore
    expect(getAllByTestId("input")[0].value).toBe("+1.19");

    getAllByTestId = renderHelper({ props: { exchangeDisabled: true } }).getAllByTestId;
    // @ts-ignore
    expect(getAllByTestId("input")[1].value).toBe("+1");
  });

  it("should render input value with two digits correctly", () => {
    let getAllByTestId = renderHelper({
      props: { inputVal: "1.6", exchangeDisabled: true }
    }).getAllByTestId;
    // @ts-ignore
    expect(getAllByTestId("input")[0].value).toBe("+1.6");

    getAllByTestId = renderHelper({
      props: { inputVal: "1.66", exchangeDisabled: true }
    }).getAllByTestId;
    // @ts-ignore
    expect(getAllByTestId("input")[1].value).toBe("+1.66");

    getAllByTestId = renderHelper({
      props: { inputVal: "1.666", exchangeDisabled: true }
    }).getAllByTestId;
    // @ts-ignore
    expect(getAllByTestId("input")[2].value).toBe("+1.67");
  });

  it('should auto pre-pend zero when user input "." at the beginning', () => {
    const { getByTestId } = renderHelper({ props: { inputVal: "." } });
    // @ts-ignore
    expect(getByTestId("input").value).toBe("+0");
  });

  it('should call the "onInputChange" with correctly parameter', () => {
    const onInputChange = jest.fn();
    const { getByTestId } = renderHelper({ props: { onInputChange } });
    // Make sure input value is valid
    const e = { target: { value: "+- abc100...66" } };
    fireEvent.change(getByTestId("input"), e);
    expect(onInputChange).toBeCalledWith("100.66");
  });

  it("should call retry when APIs error", () => {
    const data = { readyStatus: "failure" };
    const { getByTestId, dispatch } = renderHelper({
      eurRate: data,
      gbpRate: data
    });
    fireEvent.click(getByTestId("retry-input"));
    fireEvent.click(getByTestId("retry-rate"));
    expect(dispatch).toBeCalledTimes(2);
    // @ts-ignore
    expect(dispatch.mock.calls[0][0].toString()).toBe(
      fetchRate("EUR").toString()
    );
    // @ts-ignore
    expect(dispatch.mock.calls[1][0].toString()).toBe(
      fetchRate("GBP").toString()
    );
  });
});
