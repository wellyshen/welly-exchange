import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import configurecreateMockStore from "redux-mock-store";

export const testHelper = (obj: object) => {
  const store = configurecreateMockStore([thunk])(obj);
  const originalDispatch = store.dispatch;
  store.dispatch = jest.fn(originalDispatch);

  const ProviderWithStore = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return { ...store, ProviderWithStore };
};

export const gbpRateData = {
  rates: { EUR: 1.1860567172, USD: 1.3088135875 },
  base: "GBP",
  date: "2020-01-24"
};

export const eurRateData = {
  rates: { USD: 1.1035, GBP: 0.84313 },
  base: "EUR",
  date: "2020-01-24"
};

export const usdRateData = {
  rates: { EUR: 0.9062075215, GBP: 0.7640507476 },
  base: "USD",
  date: "2020-01-24"
};
