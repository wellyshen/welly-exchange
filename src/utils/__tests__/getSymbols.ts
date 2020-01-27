import getSymbols from "../getSymbols";

describe("getSymbols", () => {
  it("should get symbol correctly", () => {
    let result = getSymbols("GBP");
    expect(result).toBe("£");

    result = getSymbols("EUR");
    expect(result).toBe("€");

    result = getSymbols("USD");
    expect(result).toBe("$");
  });
});
