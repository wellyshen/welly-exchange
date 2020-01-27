import "@testing-library/jest-dom/extend-expect";

// @ts-ignore
global.MutationObserver = class {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(callback) {}
  disconnect() {}
  // @ts-ignore
  observe(element, initObject) {}
};
